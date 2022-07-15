import axios from "@/plugins/axios";
import store from "@/store";
import Code from "@/static/Code";

export default {
  data: () => ({
    ...Code,
  }),

  methods: {
    /**
     * 공통 API 호출 함수
     * @param {*} url
     * @param {*} method
     * @param {*} params
     * @param {*} body ('PUT', 'POST', 'PATCH', 'DELETE' 메소드에서만 적용 가능)
     * @param {*} errorCallback
     * @returns
     */
    async $api(url, method, params, body, errorCallback) {
      return axios({
        headers: {
          Authorization: `Bearer ${store.getters["user/token"]}`,
        },
        method: method,
        url,
        data: body,
        params,
      }).catch((e) => {
        if (
          e.response.status === this.HTTP_UNAUTHORIZED &&
          e.response?.data?.error &&
          e.response.data.error === "Invalid token"
        ) {
          alert("로그인 정보가 만료되었습니다.");

          // 토큰을 비워준다.
          store.dispatch("user/setToken", null);
        } else if (errorCallback) {
          errorCallback(e.response);
        } else if (e.response?.data?.error) {
          console.log(e.response.data.error);
          alert(e.response.data.error);
        }
        return e.response;
      });
    },
  },
};
