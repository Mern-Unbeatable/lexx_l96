import Swal from 'sweetalert2'

export const showErrorToast = (message) =>
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: message || 'Something went wrong. Please try again.',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  })
