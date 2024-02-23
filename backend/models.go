package main

type User struct {
	ID       string `json:"id,omitempty" bson:"_id,omitempty"`
	Name     string `json:"name" bson:"name"`
	Email    string `json:"email" bson:"email"`
	Password string `json:"password,omitempty" bson:"password,omitempty"` // Consider hashing passwords before storage
}

type Member struct {
	StudentID       string `json:"studentId" bson:"studentId"`
	FullName        string `json:"fullName" bson:"fullName"`
	Email           string `json:"email" bson:"email"`
	GraduationMonth string `json:"graduationMonth" bson:"graduationMonth"`
	GraduationYear  string `json:"graduationYear" bson:"graduationYear"`
	Majors          string `json:"majors" bson:"majors"`
	MinorsOrFocuses string `json:"minorsOrFocuses" bson:"minorsOrFocuses"`
	DegreeProgram   string `json:"degreeProgram" bson:"degreeProgram"`
	ShortBio        string `json:"shortBio" bson:"shortBio"`
	PictureLink     string `json:"pictureLink" bson:"pictureLink"` // Link to Amazon S3
	ResumeLink      string `json:"resumeLink" bson:"resumeLink"`   // Link to Amazon S3
}
