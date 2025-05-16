<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black opacity-50 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
        <div class="absolute right-0 top-0 pr-4 pt-4">
          <button
            type="button"
            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            @click="$emit('close')"
          >
            <span class="sr-only">{{ t('auth.close') }}</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Auth forms -->
        <div class="sm:flex sm:items-start">
          <div class="w-full">
            <div class="mb-6 text-center">
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                {{ isLogin ? t('auth.welcomeBack') : t('auth.createAccount') }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ isLogin ? t('auth.noAccount') : t('auth.haveAccount') }}
                <button
                  class="text-indigo-600 hover:text-indigo-500 font-medium"
                  @click="switchMode"
                >
                  {{ isLogin ? t('auth.signUp') : t('auth.signIn') }}
                </button>
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div v-if="!isLogin" class="relative">
                <label for="name" class="block text-sm font-medium text-gray-700">{{ t('auth.name') }}</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    required
                    minlength="2"
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :class="{ 'border-red-300': formErrors.name }"
                    :placeholder="t('auth.namePlaceholder')"
                    @blur="validateField('name')"
                  />
                </div>
                <p v-if="formErrors.name" class="mt-1 text-xs text-red-600">{{ t('auth.nameError') }}</p>
              </div>

              <div class="relative">
                <label for="email" class="block text-sm font-medium text-gray-700">{{ t('auth.email') }}</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    required
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :class="{ 'border-red-300': formErrors.email }"
                    :placeholder="t('auth.emailPlaceholder')"
                    @blur="validateField('email')"
                  />
                </div>
                <p v-if="formErrors.email" class="mt-1 text-xs text-red-600">{{ t('auth.emailError') }}</p>
              </div>

              <div class="relative">
                <label for="password" class="block text-sm font-medium text-gray-700">{{ t('auth.password') }}</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    minlength="6"
                    class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    :class="{ 'border-red-300': formErrors.password }"
                    :placeholder="t('auth.passwordPlaceholder')"
                    @blur="validateField('password')"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    @click="showPassword = !showPassword"
                  >
                    <svg 
                      v-if="showPassword"
                      class="h-5 w-5 text-gray-400 hover:text-gray-500" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    <svg 
                      v-else
                      class="h-5 w-5 text-gray-400 hover:text-gray-500" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  </button>
                </div>
                <p v-if="formErrors.password" class="mt-1 text-xs text-red-600">{{ t('auth.passwordError') }}</p>
                <p v-if="!isLogin" class="mt-1 text-xs text-gray-500">
                  {{ t('auth.passwordRequirement') }}
                </p>
              </div>

              <div v-if="error" class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700">{{ error }}</p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isLoading || hasErrors"
                >
                  <svg
                    v-if="isLoading"
                    class="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {{ isLogin ? t('auth.signIn') : t('auth.createAccount') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  defaultEmail: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'success']);

const isLogin = ref(true);
const isLoading = ref(false);
const error = ref('');
const showPassword = ref(false);

const formData = ref({
  name: '',
  email: props.defaultEmail,
  password: ''
});

const formErrors = ref({
  name: '',
  email: '',
  password: ''
});

const hasErrors = computed(() => {
  return Object.values(formErrors.value).some(error => error !== '');
});

const validateField = (field) => {
  formErrors.value[field] = '';
  
  switch (field) {
    case 'name':
      if (!isLogin.value && formData.value.name.length < 2) {
        formErrors.value.name = t('auth.nameError');
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.value.email)) {
        formErrors.value.email = t('auth.emailError');
      }
      break;
    case 'password':
      if (formData.value.password.length < 6) {
        formErrors.value.password = t('auth.passwordError');
      }
      break;
  }
};

const validateForm = () => {
  validateField('email');
  validateField('password');
  if (!isLogin.value) {
    validateField('name');
  }
  return !hasErrors.value;
};

const switchMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
  formErrors.value = {
    name: '',
    email: '',
    password: ''
  };
};

const config = useRuntimeConfig();

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  isLoading.value = true;
  error.value = '';

  try {
    const endpoint = isLogin.value ? '/api/auth/local' : '/api/auth/local/register';
    
    const requestBody = isLogin.value ? {
      identifier: formData.value.email,
      password: formData.value.password,
    } : {
      username: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
    };

    const response = await fetch(`${config.public.strapiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (!response.ok) {
      throw new Error(t('auth.authFailed'));
    }

    // Store the token
    localStorage.setItem('token', data.jwt);
    localStorage.setItem('user', JSON.stringify(data.user));

    emit('success', data);
    emit('close');
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
</script> 