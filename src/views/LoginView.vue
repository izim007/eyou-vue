<template>
  <div class="hello">
    <a id="custom-login-btn" @click="loginWithKakao">
      <img
        src="//k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
        width="222"
        alt="카카오 로그인 버튼"
      />
    </a>
  </div>
</template>

<script>
import axios from "axios";

import { mapActions, mapGetters } from "vuex";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },

  data: () => ({
    nextUrl: "",
  }),

  created() {
    if (this.$route.params.nextUrl != undefined) {
      this.nextUrl = this.$route.params.nextUrl;
    }
  },

  computed: {
    ...mapGetters("user", ["id","snsId", "token", "nickname", "profile_img"]),
  },

  methods: {
    ...mapActions("user", ["setId","setSnsId", "setToken", "setNickname", "setProfile_img"]),

    loginWithKakao() {
      //로그인
      const _this = this;
      // console.log("this", this);

      Kakao.Auth.login({
        success: function (authObj) {
          console.log(authObj);
          //사용자정보 가져오기
          Kakao.API.request({
            url: "/v2/user/me", //계정 정보를 가져오는 request url
            success: function (response) {
              console.log(response); //카카오 계정 정보
              // console.log("response.id:"+response.id);
              const snsId = "K" + response.id; //snsId에 K를 붙여서 카카오로 로그인한ID로 설정해줌
              const nickname = response.properties.nickname; //카카오 닉네임
              const profile_img = response.properties.profile_image; //카카오 프로필이미지

              // kakao Id, 닉네임,프로필사진 vuex저장
              _this.setSnsId(snsId);
              _this.setNickname(nickname);
              _this.setProfile_img(profile_img);

              this.data = {
                //backend로 전송될 POST 데이터
                snsId: snsId,
                nickname:nickname,
                profile_img:profile_img
              };
              axios
                .post(`${_this.$API_SERVER}/user/login`, this.data)
                .then((response) => {
                  console.log("response: ", response);

                  if (response?.status === _this.HTTP_OK) {
                    const token = response.data.token;
                    // console.log("this (in)", this);
                    _this.setToken(token);

                    const id = response.data.id;
                    _this.setId(id);

                    // if( _this.hasToken){ //token 값 확인
                    //   console.log("token is alive");
                    //   console.log("hastoken: "+_this.token);
                    // }
                    
                    // 로그인 성공 후 next url로 이동
                    _this.$router.push("/" + _this.nextUrl);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            },
            fail: function (error) {
              console.log(error);
            },
          });
        },
        fail: function (err) {
          console.log(JSON.stringify(err));
        },
      });
    },
  },

  mounted() {
    if (typeof Kakao === "undefined") {
      const script = document.createElement("script");
      script.onload = () => {
        //로그인할때 sdk 초기화함/사용할 앱의 javascript key로 설정
        Kakao.init("c45a020ee3dc6a62a6971ee87e00d20b");
        // Kakao.init('1259143e223d59d6de3d44e96cbca60e');
        // SDK 초기화 여부를 판단합니다.
        console.log(Kakao.isInitialized()); //true
      };
      script.src = `https://developers.kakao.com/sdk/js/kakao.js`; //사용자 인증, 로그인, 로그아웃 등의 기능을 사용가능하도록함
      document.head.appendChild(script);
    }
  },
};
</script>
