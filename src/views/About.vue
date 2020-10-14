<template>
  <div class="w-full lg:w-3/4 text-content mx-auto">
    <h1>About watch3r</h1>
    <p>Not sure if you have already seen a certain movie? Lost track of the countless things you wanted to watch or watched already? Got different lists in different places you keep forgetting about?</p>
    <p>That's where the idea for this web application came from - imagine a tool that provides basic information about the listed titles, paired with search and sorting. A place to keep track of your lists and collect your thoughts after watching.</p>
    <h2>Features</h2>
    <p>&#9733; Dedicated Watchlist and Tracklist views</p>
    <p>&#9733; Search for movies and series when adding titles to your lists</p>
    <p>&#9733; Save <i>date watched</i>, <i>rating</i> and <i>notes</i> for each title in your Tracklist</p>
    <p>&#9733; Search and sorting for each list view</p>
    <p>&#9733; PWA functionality for mobile devices to access your lists from the couch</p>
    <div class="text-center shadow-inner border-t border-b border-solid border-gray-700 px-8 py-16 -mx-8 sm:-mx-12 my-8">
      <h3 class="text-2xl text-yellow-600">Get Your Account</h3>
      <p class="text-lg mb-8">watch3r is completely free! You're welcome to give it a try.</p>
      <router-link :to="{name: 'invite'}" class="btn btn-black inline-block mx-auto" style="text-decoration: none;">
        Join Now
      </router-link>
    </div>
    <h2 class="text-center mb-6">Screenshots</h2>
    <div class="w-full lg:w-5/6 grid grid-cols-2 gap-6 mx-auto mb-4">
      <a href="/img/about_watchlist.jpg" class="preview" target="_blank" title="Enlarge (new tab)">
        <img src="/img/about_watchlist.jpg" alt="Watchlist">
      </a>
      <a href="/img/about_tracklist.jpg" class="preview" target="_blank" title="Enlarge (new tab)">
        <img src="/img/about_tracklist.jpg" alt="Tracklist">
      </a>
      <a href="/img/about_add-title.jpg" class="preview" target="_blank" title="Enlarge (new tab)">
        <img src="/img/about_add-title.jpg" alt="Add Title">
      </a>
      <a href="/img/about_edit-title.jpg" class="preview" target="_blank" title="Enlarge (new tab)">
        <img src="/img/about_edit-title.jpg" alt="Edit Title">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style lang="postcss" scoped>
  .preview img {
    @apply block rounded-sm shadow border border-gray-900;
  }

  .preview:hover img {
    @apply shadow-inner border-gray-700;
  }
</style>