package server

import (
	"net/http"
	"time"

	"github.com/NYTimes/gziphandler"
	"github.com/warmans/dbr"
	v1 "github.com/warmans/fakt/api/pkg/server/api.v1"
	"github.com/warmans/fakt/api/pkg/data"
	"github.com/warmans/fakt/api/pkg/data/media"
	"github.com/warmans/fakt/api/pkg/data/process"
	"github.com/warmans/fakt/api/pkg/data/source"
	"github.com/warmans/fakt/api/pkg/data/source/k9"
	"github.com/warmans/fakt/api/pkg/data/source/sfaktor"
	"github.com/warmans/fakt/api/pkg/data/store/common"
	"github.com/warmans/fakt/api/pkg/data/store/event"
	"github.com/warmans/fakt/api/pkg/data/store/performer"
	"github.com/warmans/fakt/api/pkg/data/store/tag"
	"github.com/warmans/fakt/api/pkg/data/store/venue"
	"github.com/warmans/go-bandcamp-search/bcamp"
	"go.uber.org/zap"
	"path"
	"os"
	mux "github.com/gorilla/mux"
)

// VERSION is used in packaging
var Version string

type Config struct {
	ServerBind             string
	ServerLocation         string
	CrawlerStressfaktorURI string
	DbPath                 string
	CrawlerRun             bool
	StaticFilesPath        string
	UIDistPath             string
}

func NewServer(conf *Config, logger *zap.Logger, db *dbr.Connection) *Server {
	return &Server{conf: conf, logger: logger, db: db}
}

type Server struct {
	conf   *Config
	logger *zap.Logger
	db     *dbr.Connection
}

func (s *Server) Start() error {

	//localize time
	time.LoadLocation(s.conf.ServerLocation)

	performerStore := &performer.Store{DB: s.db.NewSession(nil), Logger: s.logger}
	eventStore := &event.Store{DB: s.db.NewSession(nil), PerformerStore: performerStore}
	venueStore := &venue.Store{DB: s.db.NewSession(nil)}
	tagStore := &tag.Store{DB: s.db.NewSession(nil)}

	imageMirror := media.NewImageMirror(s.conf.StaticFilesPath)

	if s.conf.CrawlerRun {
		tz, err := source.MustMakeTimeLocation("Europe/Berlin")
		if err != nil {
			panic(err.Error())
		}

		dataIngest := data.Ingest{
			DB:              s.db.NewSession(nil),
			UpdateFrequency: time.Duration(1) * time.Hour,
			Crawlers: []source.Crawler{
				&sfaktor.Crawler{
					TermineURI: s.conf.CrawlerStressfaktorURI,
					Timezone:   tz,
					Logger:     s.logger.With(zap.String("component", "sfaktor crawler")),
				},
				&k9.Crawler{
					Timezone: tz,
					Logger:   s.logger.With(zap.String("component", "k9crawler")),
				},
			},
			EventVisitors: []common.EventVisitor{
				&data.PerformerStoreVisitor{PerformerStore: performerStore, Logger: s.logger},
				&data.BandcampVisitor{Bandcamp: &bcamp.Bandcamp{HTTP: http.DefaultClient}, Logger: s.logger, ImageMirror: imageMirror},
			},
			EventStore:     eventStore,
			PerformerStore: performerStore,
			VenueStore:     venueStore,
			Logger:         s.logger.With(zap.String("component", "ingest")),
		}
		go dataIngest.Run()

		//pre-calculate some stats when ingest is running

		//performer activity
		activityRunner := process.GetActivityRunner(time.Minute*10, s.logger)
		go activityRunner.Run(s.db.NewSession(nil))
	}


	API := v1.API{
		AppVersion:     Version,
		EventStore:     eventStore,
		VenueStore:     venueStore,
		PerformerStore: performerStore,
		TagStore:       tagStore,
		Logger:         s.logger,
	}

	routes := mux.NewRouter()
	routes.PathPrefix("/api/v1/").Handler(http.StripPrefix("/api/v1", API.NewServeMux()))

	// api static files
	staticFiles := http.FileServer(http.Dir("static"))
	routes.PathPrefix("/static/").Handler(http.StripPrefix("/static", gziphandler.GzipHandler(staticFiles)))

	// ui
	uiFiles := gziphandler.GzipHandler(TryFileHandler(path.Join(s.conf.UIDistPath, "index.html"), s.conf.UIDistPath))
	routes.PathPrefix("/").Handler(http.StripPrefix("/", uiFiles))

	s.logger.Info(
		"API listening",
		zap.String("bind", s.conf.ServerBind),
		zap.String("static_path", s.conf.StaticFilesPath),
		zap.String("ui_path", s.conf.UIDistPath),
	)
	return http.ListenAndServe(s.conf.ServerBind, routes)
}


func TryFileHandler(defaultFile string, fileDirs ...string) http.Handler {
	return &TryFiles{fileDirs: fileDirs, defaultFile: defaultFile}
}

type TryFiles struct {
	fileDirs    []string
	defaultFile string
}

func (h *TryFiles) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "" {
		for _, v := range h.fileDirs {
			filePath := path.Join(v, r.URL.Path)
			_, err := os.Stat(filePath)
			if err == nil {
				http.ServeFile(rw, r, filePath)
				return
			}
		}
	}
	http.ServeFile(rw, r, h.defaultFile)
}