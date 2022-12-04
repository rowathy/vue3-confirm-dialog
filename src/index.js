import Vue3ConfirmDialog from "./components/ConfirmDialog.vue";
import mitt from "mitt";

const emitter = mitt();
export default {
    install: (app, args = {}) => {
      if (this.installed) return

        this.installed = true
        this.params = args

        app.component(args.componentName || "vue3-confirm-dialog", Vue3ConfirmDialog)
    
        const confirm = params => {
          if (typeof params != "object" || Array.isArray(params)) {
            let caughtType = typeof params
            if (Array.isArray(params)) caughtType = "array"
    
            throw new Error(
              `Options type must be an object. Caught: ${caughtType}. Expected: object`
            )
          }
    
          if (typeof params === "object") {
            if (
              params.hasOwnProperty("callback") &&
              typeof params.callback != "function"
            ) {
              let callbackType = typeof params.callback
              throw new Error(
                `Callback type must be an function. Caught: ${callbackType}. Expected: function`
              )
            }
            console.log(params);
            emitter.emit("open", params)
          }
        }

        confirm.close = () => {
          emitter.emit("close")
        }
    
        app.config.globalProperties.$confirm = confirm;

        app["$confirm"] = confirm;
    }
}