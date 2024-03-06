package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

// global variable to hold the database connection
var usersCollection *mongo.Collection

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	uri := os.Getenv("MONGO_DB_URI")
	// Initialize MongoDB connection here and assign the collection to usersCollection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	// Assuming your database is called "facebookClone" and your collection "users"
	usersCollection = client.Database("nsbemembers").Collection("members")
}

func generatePresignedURL(w http.ResponseWriter, r *http.Request) {

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("us-east-1"), // Replace with your AWS region
	})
	if err != nil {
		log.Fatalf("Failed to create session: %v", err)
	}

	// Create S3 service client
	svc := s3.New(sess)
	// Extract filename and filetype from query parameters
	fileName := r.URL.Query().Get("filename")
	fileType := r.URL.Query().Get("filetype")

	// Validate or sanitize the inputs as necessary
	// ...

	// Use fileName and fileType to generate the pre-signed URL
	// Assume svc is an initialized instance of *s3.S3
	req, _ := svc.PutObjectRequest(&s3.PutObjectInput{
		Bucket:      aws.String("nsbeheadshots"),
		Key:         aws.String("uploads/" + fileName),
		ContentType: aws.String(fileType), // Setting the ContentType for the uploaded file
	})
	urlString, err := req.Presign(15 * time.Minute)

	if err != nil {
		log.Println("Failed to sign request", err)
		http.Error(w, "Failed to generate pre-signed URL", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"url": urlString})
}

// func createMember(w http.ResponseWriter, r *http.Request) {
// 	var member Member
// 	if err := json.NewDecoder(r.Body).Decode(&member); err != nil {
// 		http.Error(w, err.Error(), http.StatusBadRequest)
// 		return
// 	}

// 	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()

// 	result, err := usersCollection.InsertOne(ctx, member)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	// Create a struct to format your JSON response
// 	type response struct {
// 		Message  string `json:"message"`
// 		MemberID string `json:"memberId"` // Use the appropriate type for the ID
// 	}

// 	// Fill the response struct
// 	resp := response{
// 		Message:  "Member added successfully",
// 		MemberID: result.InsertedID.(primitive.ObjectID).Hex(), // Ensure proper type assertion; may vary based on driver version
// 	}

// 	// Set content type to application/json
// 	w.Header().Set("Content-Type", "application/json")

// 	// Marshal and write the response as JSON
// 	if err := json.NewEncoder(w).Encode(resp); err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}
// }

func createMember(w http.ResponseWriter, r *http.Request) {
	var member Member
	if err := json.NewDecoder(r.Body).Decode(&member); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := usersCollection.InsertOne(ctx, member)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Ensure proper type assertion for the version of the MongoDB Go driver
	insertedID, ok := result.InsertedID.(primitive.ObjectID)
	if !ok {
		http.Error(w, "Failed to parse inserted ID", http.StatusInternalServerError)
		return
	}

	// Create a struct to format your JSON response
	type response struct {
		Message  string `json:"message"`
		MemberID string `json:"memberId"`
	}

	// Fill the response struct
	resp := response{
		Message:  "Member added successfully",
		MemberID: insertedID.Hex(), // Convert ObjectID to hex string
	}

	// Set content type to application/json
	w.Header().Set("Content-Type", "application/json")

	// Marshal and write the response as JSON
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func listMembers(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var members []Member
	cursor, err := usersCollection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var member Member
		cursor.Decode(&member)
		members = append(members, member)
	}

	if err := cursor.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(members)
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// allowedOrigins := strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")
		// currentOrigin := r.Header.Get("Origin")

		// for _, origin := range allowedOrigins {
		// 	if origin == currentOrigin {
		// 		w.Header().Set("Access-Control-Allow-Origin", "*")
		// 		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		// 		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		// 		break
		// 	}
		// }

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	}
}

func handler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		fmt.Fprintln(w, "Hello!")
	}
}

func main() {
	http.HandleFunc("/generateurl", corsMiddleware(generatePresignedURL))
	http.HandleFunc("/members/newmember", corsMiddleware(createMember)) // create
	http.HandleFunc("/members/list", corsMiddleware(listMembers))       // read
	http.HandleFunc("/", handler)                                       // status
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // default port
	}
	fmt.Println("Server is starting on port " + port + "...")
	http.ListenAndServe(":"+port, nil)

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

// build with GOOS=linux GOARCH=amd64 go build -o app

// curl -X POST -H "Content-Type: application/json" -d '{
//     "studentId": "ZT92899",
//     "fullName": "David Ledbetter",
//     "email": "dledbetter456@gmail.com",
//     "graduationMonth": "December",
//     "graduationYear": "2023",
//     "majors": "Computer Science",
//     "minorsOrFocuses": "Intelligent Distributed Systems",
//     "degreeProgram": "BSc",
//     "shortBio": "Incoming SWE Intern at Apple | Former SWE Intern at Meraki | UMBC 23 AI/ML Magna Cum Laude | ML/Intelligent Systems Researcher | Cyber Scholar | Meyerhoff Scholar | NSBE Finance Chair | NSBE web developer",
//     "pictureLink": "https://example.com/picture.jpg",
//     "resumeLink": "https://example.com/resume.pdf"
// }' "http://localhost:8080/members/newmember"

// # Don't run again, Member added with ID: ObjectID("65d209361523a79d087eb0ba")%
