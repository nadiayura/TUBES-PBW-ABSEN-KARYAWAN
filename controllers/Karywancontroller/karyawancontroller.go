package Karywancontroller

import (
	"dashboard/models"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

var db *gorm.DB

func InitKaryawanController(database *gorm.DB) {
	db = database
}

func Index(c *gin.Context) {
	var karyawan []models.Karyawan
	db.Find(&karyawan)
	c.JSON(http.StatusOK, gin.H{"karyawan": karyawan})
}

func Show(c *gin.Context) {
	var karyawan models.Karyawan
	id := c.Param("id")

	if err := db.First(&karyawan, id).Error; err != nil {
		switch err {
		case gorm.ErrRecordNotFound:
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "Data tidak ditemukan"})
			return
		default:
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"karyawan": karyawan})
}

func Create(c *gin.Context) {
	var karyawan models.Karyawan
	if err := c.ShouldBindJSON(&karyawan); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	db.Create(&karyawan)
	c.JSON(http.StatusOK, gin.H{"karyawan": karyawan})
}

func Update(c *gin.Context) {
	var karyawan models.Karyawan
	id := c.Param("id")

	if err := c.ShouldBindJSON(&karyawan); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if db.Model(&karyawan).Where("id = ?", id).Updates(&karyawan).RowsAffected == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "tidak dapat mengupdate karyawan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data berhasil diperbarui"})
}

func Delete(c *gin.Context) {
	var karyawan models.Karyawan
	var input struct {
		Id json.Number
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	id, _ := input.Id.Int64()
	if db.Delete(&karyawan, id).RowsAffected == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Tidak dapat menghapus karyawan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data berhasil dihapus"})
}
