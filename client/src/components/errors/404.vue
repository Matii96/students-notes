<template>
  <div class="error-page">
    <h2 class="headline text-yellow">404</h2>
    <div class="error-content">
      <h3><i class="fa fa-warning text-yellow"></i>{{ $t('notFoundTitle') }}</h3>
      <p>{{ $t('notFoundContent') }}</p>
      <a @click="$router.go(-1)">
        <i class="fa fa-arrow-left"></i>
        {{ $t('return') }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.error-content {
  margin-top: 120px;
}
</style>
