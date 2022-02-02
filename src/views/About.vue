<template>
  <article class="w-full lg:w-3/4 text-content mx-auto">
    <img src="/img/logo.svg" class="max-w-xs mx-auto mb-8" alt="WATCH3R">
    <h1 class="text-xl text-gray-600">
      About this Application
    </h1>
    <p>Not sure if you have already seen a certain movie? Lost track of the countless things you wanted to watch or watched already? Got different lists in different places you keep forgetting about?</p>
    <p>That's where the idea for this web application came from - imagine a tool that provides basic information about the listed titles, paired with search and sorting. A place to keep track of your lists and collect your thoughts after watching.</p>
    <div class="flex items-center mt-8">
      <span class="text-lg text-gray-600 font-bold leading-none">Social:</span>
      <a class="px-4" href="https://www.producthunt.com/posts/watch3r" target="_blank" rel="noopener">
        <img alt="On product hunt" src="https://img.shields.io/badge/on-product%20hunt-blue.svg?style=flat-square">
      </a>
      <a class="pr-4" href="https://www.indiehackers.com/product/watch3r" target="_blank" rel="noopener">
        <img alt="On Indie Hackers" src="https://img.shields.io/badge/on-indie%20hackers-blue?style=flat-square">
      </a>
      <a class="" href="https://twitter.com/intent/tweet?text=WATCH3R%20%20https%3A%2F%2Fwatch3r.app" target="_blank" rel="noopener">
        <img alt="tweet" src="https://img.shields.io/twitter/url/https/github.com/ArmynC/ArminC-AutoExec.svg?style=flat-square&logo=twitter">
      </a>
    </div>
    <h2>Features</h2>
    <p>
      <span class="text-lg text-yellow-600">&#9733;</span>&nbsp;
      Dedicated Watchlist and Tracklist views
    </p>
    <p>
      <span class="text-lg text-yellow-600">&#9733;</span>&nbsp;
      Search for movies and series when adding titles to your lists
    </p>
    <p>
      <span class="text-lg text-yellow-600">&#9733;</span>&nbsp;
      Save <i>date watched</i>, <i>rating</i> and <i>notes</i> for each title in your Tracklist
    </p>
    <p>
      <span class="text-lg text-yellow-600">&#9733;</span>&nbsp;
      Search and sorting for each list view
    </p>
    <p>
      <span class="text-lg text-yellow-600">&#9733;</span>&nbsp;
      Get <i>recommendations</i> based on your tracklist and manual search results
    </p>
    <p>
      <span class="text-lg text-yellow-600">&#9733;</span>&nbsp;
      Complete functionality on mobile devices to access your lists from the couch
    </p>
    <p>
      <span class="text-lg text-yellow-600">&#9733;</span>&nbsp;
      IMDb list import based on their export files
    </p>
    <div class="text-center shadow-inner border-t border-b border-solid border-gray-700 px-8 py-16 -mx-8 sm:-mx-12 my-8">
      <img src="/img/icon.svg" class="mx-auto mb-8" alt="WATCH3R" style="width: 100px;">
      <h3 class="text-2xl text-yellow-600">
        Get Your Account
      </h3>
      <p class="text-lg mb-8">
        watch3r is completely free! You're welcome to give it a try.
      </p>
      <router-link :to="{name: 'invite'}" class="btn btn-black inline-block mx-auto" style="text-decoration: none;">
        Join Now
      </router-link>
    </div>
    <h2 class="text-center mb-6">
      Screenshots
    </h2>
    <div class="w-full lg:w-5/6 grid grid-cols-2 gap-6 mx-auto mb-6">
      <a href="/img/about_watchlist.jpg" class="preview" target="_blank" title="Enlarge (new tab)">
        <img src="/img/about_watchlist.jpg" alt="Watchlist" loading="lazy">
      </a>
      <a href="/img/about_tracklist.jpg" class="preview" target="_blank" title="Enlarge (new tab)">
        <img src="/img/about_tracklist.jpg" alt="Tracklist" loading="lazy">
      </a>
      <a href="/img/about_add-title.jpg" class="preview" target="_blank" title="Enlarge (new tab)">
        <img src="/img/about_add-title.jpg" alt="Add Title" loading="lazy">
      </a>
      <a href="/img/about_edit-title.jpg" class="preview" target="_blank" title="Enlarge (new tab)">
        <img src="/img/about_edit-title.jpg" alt="Edit Title" loading="lazy">
      </a>
      <a href="/img/about_recommendations.jpg" class="preview" target="_blank" title="Enlarge (new tab)">
        <img src="/img/about_recommendations.jpg" alt="Edit Title" loading="lazy">
      </a>
      <a href="/img/about_add-recommendations.jpg" class="preview" target="_blank" title="Enlarge (new tab)">
        <img src="/img/about_add-recommendations.jpg" alt="Edit Title" loading="lazy">
      </a>
    </div>
    <p class="text-3xl text-yellow-600 text-center mb-0">
      &#9733;
    </p>
  </article>
</template>