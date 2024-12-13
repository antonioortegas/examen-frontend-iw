<template>
    <div class="not-found-page flex flex-col items-center justify-center space-y-8 p-6 h-screen">
        <!-- Icon or Illustration -->
        <div class="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-accent" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19l-5-5m0 0l5-5m-5 5h16" />
            </svg>
        </div>

        <!-- Title -->
        <h1 class="text-4xl font-bold text-gray-800 text-center">Page Not Found</h1>

        <!-- Description -->
        <p class="text-lg text-gray-600 text-center max-w-xl">
            Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <!-- Redirect Link -->
        <router-link to="/"
            class="flex items-center px-4 py-2 border-2 border-accent text-sm text-accent hover:bg-accent hover:text-background rounded-lg shadow-md transition-all space-x-2">
            <span>Home</span>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'NotFound'
};
</script>