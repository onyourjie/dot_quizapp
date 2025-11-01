import Swal from 'sweetalert2';

// Custom styling for all alerts
const customSwalStyle = {
  popup: 'rounded-2xl shadow-2xl',
  title: 'text-2xl font-bold',
  htmlContainer: 'text-base text-slate-600',
  confirmButton: 'px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all',
  cancelButton: 'px-8 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all',
  denyButton: 'px-8 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all',
};

// Success Alert
export const successAlert = (title, text) => {
  return Swal.fire({
    icon: 'success',
    title: title || 'Success!',
    text: text || 'Operation completed successfully',
    confirmButtonText: 'Great!',
    customClass: customSwalStyle,
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
};

// Error Alert
export const errorAlert = (title, text) => {
  return Swal.fire({
    icon: 'error',
    title: title || 'Oops...',
    text: text || 'Something went wrong!',
    confirmButtonText: 'OK',
    customClass: customSwalStyle,
  });
};

// Warning Alert
export const warningAlert = (title, text) => {
  return Swal.fire({
    icon: 'warning',
    title: title || 'Warning',
    text: text || 'Please check your input',
    confirmButtonText: 'Got it',
    customClass: customSwalStyle,
  });
};

// Info Alert
export const infoAlert = (title, text) => {
  return Swal.fire({
    icon: 'info',
    title: title || 'Information',
    text: text,
    confirmButtonText: 'OK',
    customClass: customSwalStyle,
  });
};

// Confirmation Alert
export const confirmAlert = (title, text, confirmText = 'Yes', cancelText = 'No') => {
  return Swal.fire({
    title: title || 'Are you sure?',
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: customSwalStyle,
    reverseButtons: true,
  });
};

// Loading Alert
export const loadingAlert = (title, text) => {
  return Swal.fire({
    title: title || 'Loading...',
    text: text || 'Please wait',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: customSwalStyle,
  });
};

// Toast Notification
export const toast = (icon, title, position = 'top-end') => {
  const Toast = Swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: 'rounded-xl shadow-xl',
    }
  });

  return Toast.fire({
    icon: icon,
    title: title
  });
};

// Quiz Start Alert
export const quizStartAlert = (questionCount, difficulty) => {
  return Swal.fire({
    title: 'Ready to Start?',
    html: `
      <div class="text-left space-y-3 p-4">
        <p class="text-slate-600 text-base">You're about to begin a quiz with:</p>
        <div class="bg-blue-50 rounded-lg p-4 space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-blue-600 font-semibold">📝 Questions:</span>
            <span class="text-slate-700">${questionCount}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-blue-600 font-semibold">⚡ Difficulty:</span>
            <span class="text-slate-700 capitalize">${difficulty}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-blue-600 font-semibold">⏱️ Time:</span>
            <span class="text-slate-700">${questionCount} minutes</span>
          </div>
        </div>
        <p class="text-slate-500 text-sm mt-4">💡 Tip: You can mark questions for review and navigate freely!</p>
      </div>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: '🚀 Let\'s Go!',
    cancelButtonText: 'Cancel',
    customClass: customSwalStyle,
    width: '500px',
  });
};

// Quiz Complete Alert
export const quizCompleteAlert = (score, total, percentage) => {
  let icon = 'success';
  let title = 'Excellent Work!';
  let message = 'You did amazing! 🎉';

  if (percentage < 60) {
    icon = 'info';
    title = 'Quiz Completed!';
    message = 'Keep practicing! 📚';
  } else if (percentage < 75) {
    icon = 'success';
    title = 'Good Job!';
    message = 'Nice effort! 👍';
  } else if (percentage < 90) {
    icon = 'success';
    title = 'Great Work!';
    message = 'Well done! 🌟';
  }

  return Swal.fire({
    icon: icon,
    title: title,
    html: `
      <div class="space-y-4 p-4">
        <div class="text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ${score}/${total}
        </div>
        <p class="text-slate-600">${message}</p>
        <div class="bg-slate-50 rounded-xl p-4">
          <div class="text-3xl font-bold text-slate-700">${percentage.toFixed(1)}%</div>
          <p class="text-sm text-slate-500">Success Rate</p>
        </div>
      </div>
    `,
    confirmButtonText: 'View Results',
    customClass: customSwalStyle,
    width: '450px',
  });
};

// Time's Up Alert
export const timesUpAlert = () => {
  return Swal.fire({
    icon: 'warning',
    title: '⏰ Time\'s Up!',
    text: 'Your quiz time has expired. Let\'s see how you did!',
    confirmButtonText: 'View Results',
    allowOutsideClick: false,
    customClass: customSwalStyle,
  });
};

// Resume Quiz Alert
export const resumeQuizAlert = () => {
  return Swal.fire({
    title: 'Welcome Back!',
    text: 'You have an unfinished quiz. Would you like to continue?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '✅ Continue Quiz',
    cancelButtonText: '🆕 Start New Quiz',
    customClass: customSwalStyle,
    allowOutsideClick: false,
  });
};

// Logout Confirmation
export const logoutConfirmAlert = () => {
  return Swal.fire({
    title: 'Logout?',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Logout',
    cancelButtonText: 'Stay',
    customClass: customSwalStyle,
    reverseButtons: true,
  });
};

export default {
  successAlert,
  errorAlert,
  warningAlert,
  infoAlert,
  confirmAlert,
  loadingAlert,
  toast,
  quizStartAlert,
  quizCompleteAlert,
  timesUpAlert,
  resumeQuizAlert,
  logoutConfirmAlert,
};
