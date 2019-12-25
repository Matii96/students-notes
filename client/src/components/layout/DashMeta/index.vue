<template>
  <section class="content-header">
    <h1>
      <template v-if="$props.panelMeta.length > 0">
        {{ $props.panelMeta[$props.panelMeta.length - 1].name }}
        <small v-if="$props.panelMeta[$props.panelMeta.length - 1].description">
          {{ $props.panelMeta[$props.panelMeta.length - 1].description }}
        </small>
        <!--
        <small>
          <a @click="$router.go(-1)"><i class="fa fa-arrow-left"></i> Go back</a>
        </small>
        -->
      </template>
      <template v-else>
        {{
          $t(
            ($route.matched[$route.matched.length - 1].meta.displayName
              ? $route.matched[$route.matched.length - 1].meta.displayName
              : $route.matched[$route.matched.length - 1].name
            ).toLowerCase()
          )
        }}
      </template>
    </h1>
    <ol class="breadcrumb">
      <li>
        <router-link to="/">
          <i class="fa fa-home"></i>
          {{ $t('home') }}
        </router-link>
      </li>
      <li v-for="route in $props.panelMeta">
        <router-link :to="route.path" v-if="route.path">{{ route.name }}</router-link>
        <a v-else>{{ route.name }}</a>
      </li>
      <li>
        <a>
          {{
            $t(
              (
                $route.matched[$route.matched.length - 1].meta.displayName ||
                $route.matched[$route.matched.length - 1].name
              ).toLowerCase()
            )
          }}
        </a>
      </li>
    </ol>
  </section>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>
