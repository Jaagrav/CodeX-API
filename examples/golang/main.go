package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/url"
)

const (
	apiUrl = "https://api.codex.jaagrav.in"
)

type Response struct {
	TimeStamp int    `json:"timeStamp"`
	Status    int    `json:"status"`
	Output    string `json:"output"`
	Error     string `json:"error"`
	Language  string `json:"language"`
	Info      string `json:"info"`
}

func main() {
	queryParams := url.Values{
		"code":     {"val = int(input()) + 5\nprint(val)"},
		"language": {"py"},
		"input":    {"7"},
	}

	payload := bytes.NewReader([]byte(queryParams.Encode()))
	client := http.Client{}

	req, _ := http.NewRequest(http.MethodPost, apiUrl, payload)
	req.Header.Set("Content-type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}

	var r Response

	bytesString, _ := io.ReadAll(resp.Body)
	if err := json.Unmarshal(bytesString, &r); err != nil {
		panic(err)
	}

	log.Println(r)
}
