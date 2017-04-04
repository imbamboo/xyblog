"use strict";
var vueComponent = {};

vueComponent.reviewForm = function () {
    new Vue({
        el: "#middle",
        data: {
            postItem: {
                author: "",
                email: "",
                emailHidden: true,
                replyToEmail: true,
                content: "",
            }
        },
        created: function () {
            console.log("created");
            $("#formReview").validator({
                review_content: {
                    required: {
                        value: true,
                        msg: "请输入评论的内容。"
                    },
                    maxlength: {
                        value: 1000,
                        msg: "最多可以输入一千个字符。"
                    }
                },
                review_email: {
                    email: {
                        value: true,
                        msg: "请输入正确格式的电子邮件地址。"
                    }
                }
            });
        }, // end created
        methods: {
            postReview() {
                var valid = $("#formReview").validator();
                console.log(valid);
            }
        }, // end methods
    });
};