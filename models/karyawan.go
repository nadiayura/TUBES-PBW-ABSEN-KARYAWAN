package models

type Karyawan struct {
	Id           int64  `gorm:"primaryKey" json:"id"`
	NamaKaryawan string `gorm:"type:varchar(300)" json:"nama_karyawan"`
	Deskripsi    string `gorm:"type:text" json:"deskripsi"`
}
