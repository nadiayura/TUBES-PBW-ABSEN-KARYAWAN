document.addEventListener('DOMContentLoaded', function() {
    const karyawanForm = document.getElementById('karyawan-form');

    // Menambahkan Data karyawan
    karyawanForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const nama = document.getElementById('nama').value;
        const deskripsi = document.getElementById('deskripsi').value;

        fetch('/api/tambahkaryawan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nama_karyawan: nama, deskripsi: deskripsi})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Gagal menambahkan data karyawan. Status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data added:', data);
                karyawanForm.reset();
                Swal.fire({
                    title: 'Success!',
                    text: 'Data karyawan berhasil ditambahkan!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            })

    });
});
