import Swal from 'sweetalert2'

export const showAcceptSuccess = (playerName) =>
  Swal.fire({
    icon: 'success',
    title: 'Request accepted!',
    text: `You're matched with ${playerName}. Use Chat to arrange where to meet.`,
    confirmButtonText: 'Got it',
    confirmButtonColor: '#2D6A4F',
    buttonsStyling: true,
  })

export const simulateAcceptDelay = (ms = 900) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
