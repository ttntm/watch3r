<template>
  <div class="w-full lg:w-3/4 xl:w-2/3 text-content mx-auto">
    <h1>About watch3r</h1>
    <p>Have you ever been unsure whether or not you'd already seen a certain movie or lost track of the countless things you wanted to watch and/or watched already?</p>
    <p>IMDb is a great database, but their service is cluttered with unnecessary information, ads and things that aren't quite relevant when making time sensitive couch time choices.</p>
    <p>So, that's basically where the idea for this web application came from - needing something better than a plain text note in Google Keep or another list page Notion while having access to basic information about the listed titles, search, sorting and a place to write down your thoughts after watching something.</p>
    <h2>&plus; Features</h2>
    <ul>
      <li>Dedicated Watchlist and Tracklist views</li>
      <li>Movie/series search wen adding titles to your lists</li>
      <li>Save <i>date watched</i>, <i>rating</i> and <i>notes</i> for each title in your Tracklist</li>
      <li>Search and sorting for each list view</li>
      <li>PWA functionality for your phone/tablet to access your lists from the couch</li>
    </ul>
    <div class="text-center my-12 mx-auto">
      <h3 class="text-2xl text-yellow-600">Get Your Account Now</h3>
      <p class="text-lg mb-8">watch3r is completely free and you're welcome to try it today.</p>
      <router-link :to="{name: 'invite'}" class="btn btn-black inline-block mx-auto" style="text-decoration: none;">
        Join Now
      </router-link>
    </div>
    <h2>&plus; Screenshots</h2>
    <p>...go here</p>
    <h2>&gt; Contact</h2>
    <p>Say hi at <a href="mailto:hello@watch3r.app">hello@watch3r.app</a></p>
    <h2>&gt; Support Development</h2>
    <p>Thanks, much appreciated! :D</p>
    <a href="https://www.buymeacoffee.com/ttntm" target="_blank" class="inline-block shadow-lg hover:shadow-none hover:opacity-75" title="Thank you!">
      <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" class="mx-auto" style="height: 45px; width: auto" alt="Buy me a coffee">
    </a>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style>

</style>