import React, { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import worningStyle from "./style/contact.module.css";

type FieldValues = {
  name: string;
  yomi: string;
  mailaddress: string;
  infoType: string;
  message: string;
};

const schema = yup.object().shape({
  name: yup.string().required("お名前が入力されていません。"),
  yomi: yup
    .string()
    .required()
    .matches(/^[\u30A0-\u30FF]+$/, {
      message: "全角カナで入力してください。",
    }),
  mailaddress: yup
    .string()
    .email("不正なメールアドレスです。")
    .required("メールアドレスが入力されていません。"),
  infoType: yup.string().required("お問い合わせ内容が選択されていません。"),
  message: yup.string().required("詳細が入力されていません。"),
});

function Contact() {
  const { register, handleSubmit } = useForm<FieldValues>();

  let [errorMessage, setErrorMessage] = useState({
    errorFormName: "",
    msg: "",
  });

  const onSubmit = useCallback<SubmitHandler<FieldValues>>(
    ({ name, yomi, mailaddress, infoType, message }) => {
      console.log(name, mailaddress, infoType, message);
      schema
        .validate({ name, yomi, mailaddress, infoType, message })
        .then(() => {
          setErrorMessage({
            errorFormName: "結果",
            msg: "入力された値に問題ありません。",
          });
        })
        .catch((error) => {
          console.error(JSON.stringify(error));
          setErrorMessage({ errorFormName: error.path, msg: error.message });
        });
    },
    []
  );
  const worningFormName = errorMessage.errorFormName;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "80%",
        padding: "20px 0 0 30px",
      }}
    >
      <p>
        ヨミガナ→カタナカ以外の場合yupでエラー。メールアドレスが不正な形式の場合yupでエラー。必須チェックはHTML
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "80%",
        }}
      >
        <label htmlFor="name">お名前</label>
        <input
          {...register("name", { required: true })}
          defaultValue=""
          id="name"
          className={worningFormName === "name" ? worningStyle.red : ""}
        />
        <label htmlFor="yomi">ヨミガナ</label>
        <input
          {...register("yomi", {
            required: true,
          })}
          defaultValue=""
          id="yomi"
          className={worningFormName === "yomi" ? worningStyle.red : ""}
        />
        <label htmlFor="mailaddress">メールアドレス</label>
        <input
          {...register("mailaddress", {
            required: true,
          })}
          defaultValue=""
          id="mailaddress"
          className={worningFormName === "mailaddress" ? worningStyle.red : ""}
        />
        <label htmlFor="infoType">お問い合わせ内容</label>
        <select
          {...register("infoType", { required: true })}
          defaultValue="bug"
          id="infoType"
          className={worningFormName === "infoType" ? worningStyle.red : ""}
        >
          <option value="bug">不具合報告</option>
          <option value="request">ご要望</option>
          <option value="other">その他</option>
        </select>
        <label htmlFor="message">詳細</label>
        <textarea
          {...register("message", { required: true })}
          defaultValue=""
          id="message"
          className={worningFormName === "message" ? worningStyle.red : ""}
        />
        <button type="submit">送信</button>
      </form>
      <h3>エラーメッセージ</h3>
      <p>
        {errorMessage.errorFormName}:{errorMessage.msg}
      </p>
    </div>
  );
}

export default Contact;
