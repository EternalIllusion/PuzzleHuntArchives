<script setup lang="ts">
import { useRouter } from 'vue-router';
import { goLinkButton, PageConfigLink } from '../utils/PageConfig';

const hunts: Hunt[] = [
  { href: 'n2ph/index', title: 'N2PH' },
];

interface Hunt {
  href: string;
  title: string;
}

const router = useRouter();

function doLinkButton(link:Hunt) {
    let tslink: PageConfigLink = {
        title:link.title,
        type:"index",
        path:link.href,
    }
    goLinkButton(tslink, router);
}
</script>

<template>
  <div class="container-md">
    <div class="row header-line center">
      <div class="col">
        <h1>EterIll's PH Archive</h1>
      </div>
    </div>
    <div class="main">
      <p>这里收录了一些本人帮助各个出题组使用CCXC Engine举办的hunt的归档。</p>
      <ul class="hunt-list">
        <li v-for="link in hunts" :key="link.href" @click="doLinkButton(link)">
          <span>
            {{ link.title }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
    ul.hunt-list {
        border-top:2px solid #000;
        border-bottom:2px solid #000;
        padding: 0;
        list-style-type: none;
        li {
            border-bottom: 1px solid #000;
            transition: all .5s ease;
            padding-left: 1rem;
            padding-right: 1rem;
            font-size: 1rem;
            cursor: pointer;
        }
        li:hover {
            padding-left: 1.5rem;
            font-size: 1.5rem;
        }
    }
</style>