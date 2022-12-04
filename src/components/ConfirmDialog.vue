<template>
  <transition name="fade">
    <div
      v-if="isShow"
      @click="handleClickOverlay"
      class="vc-overlay"
      id="vueConfirm"
    >
      <transition name="zoom">
        <div v-if="isShow" ref="vueConfirmDialog" class="vc-container">
          <span class="vc-text-grid">
            <h4 v-if="dialog.title" class="vc-title" v-html="dialog.title"></h4>
            <p v-if="dialog.message" class="vc-text" v-html="dialog.message"></p>
            <span v-if="dialog.auth">
              <input
                v-focus
                v-model="password"
                @keyup.13="e => handleClickButton(e, true)"
                class="vc-input"
                type="password"
                name="vc-password"
                placeholder="Password"
                autocomplete="off"
              />
            </span>
          </span>
          <div
            class="vc-btn-grid"
            :class="{ isMono: !dialog.button.no || !dialog.button.yes }"
          >
            <button
              v-if="dialog.button.no"
              @click.stop="e => handleClickButton(e, false)"
              class="vc-btn left"
              type="button"
            >
              {{ dialog.button.no }}
            </button>

            <button
              v-if="dialog.button.yes"
              :disabled="dialog.auth ? !password : false"
              @click.stop="e => handleClickButton(e, true)"
              class="vc-btn"
              type="button"
            >
              {{ dialog.button.yes }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { createApp } from "vue";
import mitt from "mitt";
const emitter = mitt();

const app = createApp({})

app.directive("focus", {
  inserted: function(el) {
    el.focus()
  }
})

const Vue3DialogConfirm = {
  name: "Vue3ConfirmDialog",
  data() {
    return {
      isShow: false,
      password: null,
      dialog: {
        auth: false,
        title: "",
        message: "",
        button: {}
      },
      params: {}
    }
  },
  methods: {
    resetState() {
      this.password = null
      this.dialog = {
        auth: false,
        title: "",
        message: "",
        button: {},
        callback: () => {}
      }
    },
    handleClickButton({ target }, confirm) {
      if (target.id == "vueConfirm") return
      if (confirm && this.dialog.auth && !this.password) return
      this.isShow = false
      // callback
      if (this.params.callback) {
        this.params.callback(confirm, this.password)
      }
    },
    handleClickOverlay({ target }) {
      if (target.id == "vueConfirm") {
        this.isShow = false
        // callback
        if (this.params.callback) {
          this.params.callback(false, this.password)
        }
      }
    },
    handleKeyUp({ keyCode }) {
      if (keyCode == 27) {
        this.handleClickOverlay({ target: { id: "vueConfirm" } })
      }
      if (keyCode == 13) {
        this.handleClickButton({ target: { id: "" } }, true)
      }
    },
    open(params) {
      this.resetState()
      this.params = params
      this.isShow = true
      // set params to dialog state
      Object.entries(params).forEach(param => {
        if (typeof param[1] == typeof this.dialog[param[0]]) {
          this.dialog[param[0]] = param[1]
        }
      })
    }
  },
  mounted() {
    if (!document) return
    emitter.on("open", this.open)
    emitter.on("close", () => {
      this.handleClickOverlay({ target: { id: "vueConfirm" } })
    });
  },
}

export default Vue3DialogConfirm
</script>
