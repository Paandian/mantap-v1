<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  roles: {
    type: Array,
    required: true
  },
  statuses: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const updateFilter = (key, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}

const clearFilters = () => {
  emit('update:modelValue', {
    search: '',
    role: null,
    status: null,
    dateFrom: null,
    dateTo: null
  })
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
    <div class="flex flex-wrap items-center gap-4">
      <!-- Search -->
      <div class="flex-1 min-w-[200px]">
        <div class="relative">
          <input
            :value="modelValue.search"
            @input="updateFilter('search', $event.target.value)"
            type="text"
            placeholder="Search users by name or email..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Role Filter -->
      <div>
        <select
          :value="modelValue.role"
          @change="updateFilter('role', $event.target.value || null)"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Roles</option>
          <option v-for="role in roles" :key="role.value" :value="role.value">
            {{ role.label }}
          </option>
        </select>
      </div>

      <!-- Status Filter -->
      <div>
        <select
          :value="modelValue.status"
          @change="updateFilter('status', $event.target.value || null)"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option v-for="status in statuses" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>

      <!-- Clear Filters -->
      <button
        @click="clearFilters"
        class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        :disabled="!modelValue.search && !modelValue.role && !modelValue.status"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>