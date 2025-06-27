"use client";

import { http } from "@/app/http";
import PageLoading from "@/components/PageLoading";
import { User } from "@/types/user";
import {
  ExclamationTriangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import z from "zod";
import DialogDeleteAccount from "./DialogDeleteAccount";
import { openDialog } from "@/helper/methods/dialogHelper";
import DialogChangePassword from "./DialogChangePassword";
import DialogChangePasswordWithoutCurrentPassword from "./DialogChangePasswordWithoutCurrentPassword";
import DialogRemoveAvatar from "./DialogRemoveAvatar";
import axios from "axios";
import { useUser } from "@/app/context/UserContext";

export default function BasicData() {
  const [user, setUser] = useState<User | null>(null);
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [updateBasicDataLoading, setUpdateBasicDataLoading] =
    useState<boolean>(false);
  const [userHasPassword, setUserHasPassword] = useState<boolean>(false);
  const [updatedAvatar, setUpdatedAvatar] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(10);
  const [oldAvatarUrl, setOldAvatarUrl] = useState<string>("");
  const [undoChangeAvatarLoading, setUndoChangeAvatarLoading] =
    useState<boolean>(false);
  const [uploadAvatarLoading, setUploadAvatarLoading] =
    useState<boolean>(false);
  const { updateUser } = useUser();

  const profileSchema = z.object({
    name: z.string().min(1, { message: t("required_field") }),
  });
  type ProfileFormData = z.infer<typeof profileSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await http.get("/api/user/get-by-email");

      setUser(data.payload);
      setOldAvatarUrl(data.payload.image);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchUserHasPassword = async () => {
    setLoading(true);
    try {
      const { data } = await http.get("/api/user/has-password");
      setUserHasPassword(data.payload);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadAvatarLoading(true);

    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        toast.error(t("file_too_large"));
        setUploadAvatarLoading(false);
        return;
      }

      const savedImageBeforeUpdate = user?.image;

      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await axios.post(
        "/api/user/upload-profile-image",
        formData
      );

      setUser(data.payload);
      updateUser(data.payload);

      if (savedImageBeforeUpdate && savedImageBeforeUpdate.length > 0) {
        setUpdatedAvatar(true);
      } else {
        setOldAvatarUrl(data.payload.image);
      }
      toast.success(t("profile_image_success_update"));
    } catch (err) {
    } finally {
      setUploadAvatarLoading(false);
    }
  }

  const onSubmit = async (userToUpdate: ProfileFormData) => {
    setUpdateBasicDataLoading(true);
    try {
      let payload = { name: userToUpdate.name };
      const { data } = await http.patch("/api/user/update-basic-data", payload);
      setUser(data.payload);
      updateUser(data.payload);
      toast.success(t("saved"));
    } catch (err) {
    } finally {
      setUpdateBasicDataLoading(false);
    }
  };

  async function handleUndoChangeAvatar() {
    setUndoChangeAvatarLoading(true);
    try {
      let payload = { avatarUrl: oldAvatarUrl };
      const { data } = await http.patch(
        "/api/user/undo-change-avatar",
        payload
      );
      setUser(data.payload);
      updateUser(data.payload);
      setUpdatedAvatar(false);
      toast.success(t("saved"));
    } catch (err) {
    } finally {
      setUndoChangeAvatarLoading(false);
    }
  }

  function handleSuccessRemoveAvatar() {
    if (user) {
      const updatedUser = {
        ...user,
        image: null,
      };
      setUser(updatedUser);
      updateUser(updatedUser);
    }

    setUpdatedAvatar(true);
  }

  useEffect(() => {
    if (!user) {
      fetchUser();
      fetchUserHasPassword();
    }
  }, []);

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
    }
  }, [user]);

  useEffect(() => {
    if (!updatedAvatar || undoChangeAvatarLoading) {
      setCountdown(10);
      return;
    }

    if (countdown === 0) {
      if (user) {
        setOldAvatarUrl(user.image ?? "");
      }
      setUpdatedAvatar(false);
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, updatedAvatar, undoChangeAvatarLoading]);

  return (
    <div>
      {user && !loading && (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-base-100 p-8 rounded-3xl shadow-lg border border-base-200 w-full max-w-xl transition-all">
            <>
              <div className="flex flex-col items-center gap-3 mb-8">
                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-gray-500 text-center mb-5">
                    {t("manage_your_profile_info")}
                  </p>
                </div>

                {user.image ? (
                  <>
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-24 h-24 rounded-full ring-2 ring-primary shadow-md object-cover"
                    />

                    {!updatedAvatar && (
                      <div className="flex gap-2 mt-2">
                        <label
                          title={t("change_image")}
                          htmlFor="avatar"
                          className={`btn btn-sm btn-outline btn-primary  cursor-pointer ${uploadAvatarLoading ? "btn-disabled" : ""}`}
                        >
                          {uploadAvatarLoading && (
                            <span className="loading loading-spinner"></span>
                          )}
                          {t("change_image")}
                        </label>
                        <input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleAvatarChange(e)}
                        />
                        <button
                          title={t("remove")}
                          disabled={uploadAvatarLoading}
                          onClick={() => openDialog("dialog_remove_avatar")}
                          className="btn btn-sm btn-outline btn-error"
                        >
                          {t("remove")}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <UserCircleIcon className="w-16 h-16 text-gray-400" />
                    {!updatedAvatar && (
                      <div>
                        <label
                          title={t("add_image")}
                          htmlFor="avatar-empty"
                          className={`btn btn-sm btn-outline btn-primary  cursor-pointer ${uploadAvatarLoading ? "btn-disabled" : ""}`}
                        >
                          {uploadAvatarLoading && (
                            <span className="loading loading-spinner"></span>
                          )}
                          {t("add_image")}
                        </label>
                        <input
                          id="avatar-empty"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleAvatarChange(e)}
                        />
                      </div>
                    )}
                  </>
                )}
                {updatedAvatar && (
                  <button
                    title={t("undo_changes")}
                    disabled={undoChangeAvatarLoading}
                    onClick={handleUndoChangeAvatar}
                    className="btn btn-sm btn-primary"
                  >
                    {undoChangeAvatarLoading && (
                      <span className="loading loading-spinner"></span>
                    )}
                    {t("undo_changes")}{" "}
                    {undoChangeAvatarLoading ? "" : `${countdown}s`}
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Nome completo"
                    className="input input-bordered w-full"
                  />
                  {errors.name && (
                    <span className="input-error-message">
                      <ExclamationTriangleIcon />
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input input-disabled w-full bg-base-200"
                />

                <div className="alert alert-info alert-outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                  <span>
                    {t("to_change_email_talk_suport_text")}{" "}
                    <span className="font-semibold">snipplyurl@gmail.com</span>
                  </span>
                </div>

                <button
                  title={t("save")}
                  disabled={updateBasicDataLoading}
                  type="submit"
                  className="btn w-full btn-primary"
                >
                  {updateBasicDataLoading && (
                    <span className="loading loading-spinner"></span>
                  )}
                  {t("save")}
                </button>
              </form>

              <div className="mt-10 border-t border-base-200 pt-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  {t("account_security")}
                </h3>

                <button
                  title={t("change_password")}
                  className="btn btn-outline w-full"
                  onClick={() => {
                    if (userHasPassword) {
                      openDialog("dialog_change_password");
                    } else {
                      openDialog(
                        "dialog_change_password_without_current_password"
                      );
                    }
                  }}
                >
                  {t("change_password")}
                </button>

                <button
                  title={t("delete_account")}
                  onClick={() => openDialog("dialog_delete_account")}
                  className="btn btn-outline btn-error w-full"
                >
                  {t("delete_account")}
                </button>

                <DialogDeleteAccount name={user.name} />
                <DialogChangePassword />
                <DialogChangePasswordWithoutCurrentPassword />
                <DialogRemoveAvatar
                  onSuccess={() => handleSuccessRemoveAvatar()}
                />
              </div>
            </>
          </div>
        </div>
      )}
      {loading && <PageLoading />}
    </div>
  );
}
