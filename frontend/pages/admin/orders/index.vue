<script setup lang="ts">
definePageMeta({
  middleware: ['admin']
});

const localePath = useLocalePath();
const { fetchOrders, orders, loading, error } = useOrders();
const currentPage = ref(1);
const pageSize = ref(10);
const pagination = ref({
  page: 1,
  pageSize: 10,
  pageCount: 1,
  total: 0
});

const statusFilter = ref<string>('all');
const statusOptions = [
  { value: 'all' },
  { value: 'pending' },
  { value: 'processing' },
  { value: 'completed' },
  { value: 'cancelled' }
] as const;

const loadOrders = async () => {
  try {
    const result = await fetchOrders(currentPage.value, pageSize.value);
    pagination.value = result.pagination;
  } catch (e) {
    console.error('Error loading orders:', e);
  }
};

const handlePageChange = async (page: number) => {
  currentPage.value = page;
  await loadOrders();
};

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

const filteredOrders = computed(() => {
  if (statusFilter.value === 'all') return orders.value;
  return orders.value.filter(order => order.status === statusFilter.value);
});

const handleNewOrder = () => {
  navigateTo(localePath('/admin/orders/new'));
};

onMounted(() => {
  loadOrders();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ $t('admin.orders.title') }}</h1>
      <button
        @click="handleNewOrder"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        {{ $t('admin.orders.newOrder') }}
      </button>
    </div>

    <div class="mb-6">
      <select
        v-model="statusFilter"
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
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border rounded-lg">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.orders.id') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.orders.date') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.orders.customer') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.orders.total') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.orders.status') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('admin.orders.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="loading" class="text-center">
            <td colspan="6" class="px-6 py-4">{{ $t('admin.orders.loading') }}</td>
          </tr>
          <tr v-else-if="error" class="text-center text-red-500">
            <td colspan="6" class="px-6 py-4">{{ error }}</td>
          </tr>
          <tr
            v-else
            v-for="order in filteredOrders"
            :key="order.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap">{{ order.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(order.createdAt!) }}</td>
            <td class="px-6 py-4">
              <div>{{ order.customerName }}</div>
              <div class="text-sm text-gray-500">{{ order.customerEmail }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ order.total.toFixed(2) }}€</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 py-1 text-xs rounded-full': true,
                  'bg-yellow-100 text-yellow-800': order.status === 'pending',
                  'bg-blue-100 text-blue-800': order.status === 'processing',
                  'bg-green-100 text-green-800': order.status === 'completed',
                  'bg-red-100 text-red-800': order.status === 'cancelled'
                }"
              >
                {{ $t(`admin.orders.statuses.${order.status}`) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <NuxtLink
                :to="localePath(`/admin/orders/${order.id}`)"
                class="text-blue-600 hover:text-blue-800 mr-3"
              >
                {{ $t('admin.orders.view') }}
              </NuxtLink>
              <NuxtLink
                :to="localePath(`/admin/orders/${order.id}/edit`)"
                class="text-green-600 hover:text-green-800"
              >
                {{ $t('admin.orders.edit') }}
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-6 flex justify-center">
      <nav class="flex items-center gap-2">
        <button
          v-for="page in pagination.pageCount"
          :key="page"
          @click="handlePageChange(page)"
          :class="{
            'px-3 py-1 rounded': true,
            'bg-blue-500 text-white': currentPage === page,
            'bg-gray-200 hover:bg-gray-300': currentPage !== page
          }"
        >
          {{ page }}
        </button>
      </nav>
    </div>
  </div>
</template> 