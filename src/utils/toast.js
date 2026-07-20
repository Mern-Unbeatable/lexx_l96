import Swal from 'sweetalert2'

const toastDefaults = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
}

export const showErrorToast = (message) =>
  Swal.fire({
    ...toastDefaults,
    icon: 'error',
    title: message || 'Something went wrong. Please try again.',
  })

export const showSuccessToast = (message) =>
  Swal.fire({
    ...toastDefaults,
    icon: 'success',
    title: message,
  })

export const showErrorAlert = (message, title = 'Something went wrong') =>
  Swal.fire({
    icon: 'error',
    title,
    text: message || 'Something went wrong. Please try again.',
    confirmButtonText: 'Try again',
    confirmButtonColor: '#2D6A4F',
  })

export const showSuccessAlert = (message) =>
  Swal.fire({
    icon: 'success',
    title: 'Profile updated',
    text: message || 'Your profile has been updated successfully.',
    confirmButtonText: 'Done',
    confirmButtonColor: '#2D6A4F',
  })

export const showInfoAlert = (message) =>
  Swal.fire({
    icon: 'info',
    title: 'Coming soon',
    text: message,
    confirmButtonText: 'Got it',
    confirmButtonColor: '#2D6A4F',
  })
