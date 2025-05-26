<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Order } from '~/types/order';

definePageMeta({
  middleware: ['admin']
});

const route = useRoute();
const localePath = useLocalePath();
const { fetchOrder, updateOrder, currentOrder, loading, error } = useOrders();
const orderId = Number(route.params.id);

const isEditing = ref(false);
const editedOrder = ref<Partial<Order>>({});

onMounted(async () => {
  await fetchOrder(orderId);
  if (currentOrder.value) {
    editedOrder.value = { ...currentOrder.value };
  }
});

const formatDate = (dateString: string) => {
  const { locale } = useI18n();
  return new Date(dateString).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleStatusUpdate = async (event: Event) => {
  const select = event.target as HTMLSelectElement;
  const newStatus = select.value as Order['status'];
  
  try {
    await updateOrder(orderId, { status: newStatus });
    // Refresh data
    await fetchOrder(orderId);
  } catch (e) {
    console.error('Error updating status:', e);
  }
};

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
] as const;
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      {{ $t('admin.orders.loading') }}
    </div>
    
    <div v-else-if="error" class="text-center text-red-500 py-8">
      {{ error }}
    </div>

    <div v-else-if="currentOrder" class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-2xl font-bold mb-2">
            {{ $t('admin.orderDetails.title') }}{{ currentOrder.id }}
          </h1>
          <p class="text-gray-600">
            {{ $t('admin.orderDetails.created') }} {{ formatDate(currentOrder.createdAt!) }}
          </p>
        </div>
        
        <div class="flex items-center gap-4">
          <select
            v-model="currentOrder.status"
            @change="handleStatusUpdate"
            class="border rounded px-3 py-2"
          >
            <option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ $t(`admin.orders.statuses.${option.value}`) }}
            </option>
          </select>
          
          <NuxtLink
            :to="localePath(`/admin/orders/${currentOrder.id}/edit`)"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {{ $t('common.edit') }}
          </NuxtLink>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">{{ $t('admin.orderDetails.customerInfo') }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-600">{{ $t('admin.orderDetails.fullName') }}</p>
            <p class="font-medium">{{ currentOrder.customerName }}</p>
          </div>
          <div>
            <p class="text-gray-600">{{ $t('admin.orderDetails.email') }}</p>
            <p class="font-medium">{{ currentOrder.customerEmail }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">{{ $t('admin.orderDetails.shippingAddress') }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-600">{{ $t('admin.orderDetails.fullName') }}</p>
            <p class="font-medium">
              {{ currentOrder.shippingAddress.firstName }}
              {{ currentOrder.shippingAddress.lastName }}
            </p>
          </div>
          <div>
            <p class="text-gray-600">{{ $t('admin.orderDetails.address') }}</p>
            <p class="font-medium">{{ currentOrder.shippingAddress.address }}</p>
          </div>
          <div>
            <p class="text-gray-600">{{ $t('admin.orderDetails.city') }}</p>
            <p class="font-medium">{{ currentOrder.shippingAddress.city }}</p>
          </div>
          <div>
            <p class="text-gray-600">{{ $t('admin.orderDetails.postalCode') }}</p>
            <p class="font-medium">{{ currentOrder.shippingAddress.postalCode }}</p>
          </div>
          <div>
            <p class="text-gray-600">{{ $t('admin.orderDetails.country') }}</p>
            <p class="font-medium">{{ currentOrder.shippingAddress.country }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">{{ $t('admin.orderDetails.paymentDetails') }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-600">{{ $t('admin.orders.total') }}</p>
            <p class="font-medium">{{ currentOrder.total.toFixed(2) }}€</p>
          </div>
          <div>
            <p class="text-gray-600">{{ $t('admin.orderDetails.stripeId') }}</p>
            <p class="font-medium">{{ currentOrder.stripeSessionId }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      {{ $t('admin.orders.notFound') }}
    </div>
  </div>
</template> 