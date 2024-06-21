package Usercontroller

import (
	"dashboard/models"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"html/template"
	"net/http"
)

var db *gorm.DB
var templates *template.Template

func InitUserController(database *gorm.DB, tmpl *template.Template) {
	db = database
	templates = tmpl
}

func RegisterUser(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	// Buat user baru
	user := models.User{Username: username, Password: password}
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Registration successful", "redirect": "/"})

}

func LoginUser(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	var user models.User
	if err := db.Where("username = ? AND password = ?", username, password).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Username dan Password Salah !"})
		return
	}

	session := sessions.Default(c)
	session.Set("user_id", user.ID)
	session.Save()

	c.JSON(http.StatusOK, gin.H{"message": "Registration successful", "redirect": "/dashboard"})
}

func LogoutUser(c *gin.Context) {
	session := sessions.Default(c)
	session.Delete("user_id")
	session.Save()
	c.Redirect(http.StatusMovedPermanently, "/")
}

func AuthRequired(c *gin.Context) {
	session := sessions.Default(c)
	userID := session.Get("user_id")
	if userID == nil {
		c.Redirect(http.StatusMovedPermanently, "/")
		return
	}
	c.Next()
}

func ShowDashboard(c *gin.Context) {
	session := sessions.Default(c)
	userID := session.Get("user_id")

	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	data := gin.H{
		"username": user.Username,
	}

	if err := templates.ExecuteTemplate(c.Writer, "index.html", data); err != nil {
		c.String(http.StatusInternalServerError, err.Error())
	}
}
