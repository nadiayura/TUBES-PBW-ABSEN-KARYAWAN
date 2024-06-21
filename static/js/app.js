document.addEventListener('DOMContentLoaded', function() {
    const karyawanList = document.getElementById('karyawan-list');
    const searchKaryawan = document.getElementById('searchKaryawan');
    const editKaryawanForm = document.getElementById('editKaryawanForm');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');

    // Menampilkan data karyawan
    function fetchKaryawans() {
        fetch('/api/karyawan')
            .then(response => response.json())
            .then(data => {
                console.log('Data fetched from API:', data); // Logging data yang diterima
                karyawanList.innerHTML = '';
                if (data.karyawan && data.karyawan.length > 0) {
                    data.karyawan.forEach(karyawan => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td class="">${karyawan.id}</td>
                            <td class="">${karyawan.nama_karyawan}</td>
                            <td class="">${karyawan.deskripsi}</td>
                            <td class="align-middle">
                                <button class="btn btn-primary btn-circle btn-sm" onclick="editKaryawan(${karyawan.id}, '${karyawan.nama_karyawan}', '${karyawan.deskripsi}')"><i class="fa fa-pen-to-square"></i></button>
                                <button class="btn btn-danger btn-circle btn-sm" onclick="tampilHapusModal(${karyawan.id}, '${karyawan.nama_karyawan}', '${karyawan.deskripsi}')"><i class="fa-regular fa-trash-can"></i></button>
                            </td>
                        `;
                        karyawanList.appendChild(row);
                    });
                } else {
                    console.log('No karyawan found');
                }
            })
            .catch(error => console.error('Error fetching karyawans:', error));
    }
    fetchKaryawans();

    // Edit data karyawan
    function editKaryawan(id, nama, deskripsi) {
        document.getElementById('editKaryawanId').value = id;
        document.getElementById('editNama').value = nama;
        document.getElementById('editDeskripsi').value = deskripsi;
        $('#editKaryawanModal').modal('show');
    }

    editKaryawanForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = document.getElementById('editKaryawanId').value;
        const nama = document.getElementById('editNama').value;
        const deskripsi = document.getElementById('editDeskripsi').value;

        fetch(`/api/karyawan/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nama_karyawan: nama, deskripsi: deskripsi })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Data berhasil diperbarui') {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Data karyawan berhasil diperbarui!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    fetchKaryawans();
                    $('#editKaryawanModal').modal('hide');
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.message || 'Terjadi kesalahan saat memperbarui data karyawan.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch(error => {
                console.error('Error updating karyawan:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat memperbarui data karyawan.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });

    // Hapus data karyawan
    function tampilHapusModal(id, nama, deskripsi) {
        document.getElementById('hapusKaryawanId').value = id;
        document.getElementById('hapusNama').value = nama;
        document.getElementById('hapusDeskripsi').value = deskripsi;
        $('#hapusKaryawanModal').modal('show');
    }

    confirmDeleteButton.addEventListener('click', function() {
        const id = document.getElementById('hapusKaryawanId').value;

        fetch(`/api/karyawan/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Data berhasil dihapus') {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Data karyawan berhasil dihapus!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    fetchKaryawans();
                    $('#hapusKaryawanModal').modal('hide');
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.message || 'Terjadi kesalahan saat menghapus data karyawan.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch(error => {
                console.error('Error deleting karyawan:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat menghapus data karyawan.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });

    window.tampilHapusModal = tampilHapusModal;
    window.editKaryawan = editKaryawan;

    // Mencari karyawan berdasarkan ID
    searchKaryawan.addEventListener('submit', function(event) {
        event.preventDefault();
        const karyawanId = document.getElementById('karyawanId').value;

        fetch(`/api/karyawan/${karyawanId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.karyawan) {
                    const karyawan = data.karyawan;
                    Swal.fire({
                        title: 'Data Karyawan Ditemukan',
                        html: `
                            <p><strong>ID:</strong> ${karyawan.id}</p>
                            <p><strong>Nama:</strong> ${karyawan.nama}</p>
                            <p><strong>Deskripsi:</strong> ${karyawan.deskripsi}</p>
                        `,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Tidak Ditemukan',
                        text: data.message || 'Data karyawan tidak ditemukan.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching karyawan:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Terjadi kesalahan saat mencari data karyawan.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });



    fetchKaryawans();
});
