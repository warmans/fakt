package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path"
	"time"

	"github.com/NYTimes/gziphandler"
	"github.com/gorilla/mux"
)

const Version = "0.0.0"

// Backend for the Frontend
func main() {

	bind := flag.String("server.bind", ":1313", "Web server bind address")
	ver := flag.Bool("v", false, "Print version and exit")
	faktAPIHost := flag.String("api.fakt.host", "http://localhost:8080", "Proxy api to avoid CORS crap")
	distDir := flag.String("dist.dir", "dist", "path to dist assets dir")

	flag.Parse()

	if *ver {
		fmt.Printf("%s", Version)
		os.Exit(0)
	}

	//routing
	router := mux.NewRouter()

	var notFoundHandler http.HandlerFunc
	notFoundHandler = func(rw http.ResponseWriter, r *http.Request) {
		log.Println("not found")
		http.ServeFile(rw, r, path.Join(*distDir, "index.html"))
	}
	router.NotFoundHandler = notFoundHandler

	//API proxy
	apiHostParsed, err := url.Parse(*faktAPIHost)
	if err != nil {
		log.Fatalf("Invalid URL for api.host: %s", *faktAPIHost)
	}
	log.Printf("Proxying API calls to: %s", apiHostParsed)
	router.PathPrefix("/api/v1/").Handler(
		httputil.NewSingleHostReverseProxy(apiHostParsed),
	)
	router.PathPrefix("/static/").Handler(
		httputil.NewSingleHostReverseProxy(apiHostParsed),
	)

	//public assets
	log.Printf("Serving assets from: %s", *distDir)
	staticFileServer := gziphandler.GzipHandler(TryFileHandler(path.Join(*distDir, "index.html"), *distDir))
	router.PathPrefix("/").Handler(http.StripPrefix("/", staticFileServer))

	for true {
		log.Printf("Listening on %s", *bind)
		err := http.ListenAndServe(*bind, router)
		log.Printf("SERVER FAILED: %s", err.Error())
		time.Sleep(1 * time.Second) //retry in 1 second
	}
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
