import * as Yup from "yup";

export const signUpSchema = Yup.object({
  name: Yup.string()
    .required("Tam adınızın girilmesi gerekmektedir")
    .matches(/^[a-zA-Z_ ]*$/, "Özel karakter giremezsiniz")
    .min(2, "Adınızın 2 ila 16 karakter arasında olması gerekmektedir.")
    .max(25, "Adınızın 2 ila 16 karakter arasında olması gerekmektedir."),
  email: Yup.string()
    .required("Email adresinizi giriniz")
    .email("Geçersiz email adresi"),
  status: Yup.string().max(64, "Durumunuz en fazla 64 karakter olabilir."),
  password: Yup.string()
    .required("Şifrenizi giriniz")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Şifre en az 6 karakter olmalı, 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter barındırmalı."
    ),
});

export const signInSchema = Yup.object({
  email: Yup.string()
    .required("Email adresi gereklidir")
    .email("Geçersiz email adresi."),
  password: Yup.string().required("Şifre gereklidir."),
});
