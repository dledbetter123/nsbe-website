package main

import (
	"context"
	"fmt"
	"net/url"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Your raw username and password
	username := "baron1"
	rawPassword := "M1s!ki1TM2s@ki2T" // Example password that needs encoding

	// URL encode the password. Note: Use this method cautiously for URI components.
	encodedPassword := url.QueryEscape(rawPassword)

	// Construct the MongoDB URI with the encoded password
	uri := fmt.Sprintf("mongodb+srv://%s:%s@nsbemembers.k1sx7jv.mongodb.net/?retryWrites=true&w=majority", username, encodedPassword)

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)

	// Create a new client and connect to the server
	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}

	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	// Send a ping to confirm a successful connection
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Err(); err != nil {
		panic(err)
	}
	fmt.Println("Pinged your deployment. You successfully connected to MongoDB!")
}
