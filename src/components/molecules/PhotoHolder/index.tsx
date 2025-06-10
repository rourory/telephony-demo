import { Box, IconButton } from "@mui/material";
import React from "react";
import Avatar from "@mui/material/Avatar/Avatar";
import LoadingCurtain from "../LoadingCurtain";
import { useDispatch, useSelector } from "react-redux";
import { DeleteForever, PhotoCamera } from "@mui/icons-material";
import styles from "./photo-holder.module.scss";
import { RELATIVES, ADMINISTRATION, CONVICTED } from "../../../api/end-points";
import { uploadImage, deleteImage, fetchImage } from "../../../api/queries";
import { appSettingsStateSelector } from "../../../redux/slices/app-settings-slice/app-settings-slice";
import { addNotification } from "../../../redux/slices/notify-slice/notify-slice";
import {
  photoHolderUnitSelector,
  setPhotoHolderFetchingStatus,
} from "../../../redux/slices/photo-holder-slice/photo-holder-slice";
import { userPermissions } from "../../../redux/slices/user-slice/user-slice";
import { AppDispatch, RootState } from "../../../redux/store";
import createImageFromBlob from "../../../utils/image-utils";

type Props = {
  id: number;
  entity: PhotoHolderEntity;
  margin: string;
  width: number;
  height: number;
  showControls: boolean;
};

const resolveEntryPointByEntity = (entity: PhotoHolderEntity) => {
  switch (entity) {
    case "RELATIVE":
      return RELATIVES;
    case "ADMINISTRATION":
      return ADMINISTRATION;
    case "CONVICTED":
      return CONVICTED;
    default:
      return "";
  }
};

export const PhotoHolder: React.FC<Props> = ({
  id,
  entity,
  margin,
  width,
  height,
  showControls,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [image, setImage] = React.useState<string | undefined>(undefined);
  const unit = useSelector((state: RootState) =>
    photoHolderUnitSelector(state, id, "RELATIVE")
  );
  const { backendAddress, backendProtocol, backendPort } = useSelector(
    appSettingsStateSelector
  );

  const handleUpload = React.useCallback(
    (event: any) => {
      setImage(undefined);
      dispatch(
        setPhotoHolderFetchingStatus({
          id: id,
          entity: entity,
          state: "LOADING",
        })
      );
      const formData = new FormData();
      formData.append("image", event.target.files[0]);
      uploadImage(
        {
          backendProtocol: backendProtocol,
          backendAddress: backendAddress,
          backendPort: backendPort,
        },
        resolveEntryPointByEntity(entity),
        id,
        formData
      )
        .then((res: ArrayBuffer) => {
          dispatch(
            setPhotoHolderFetchingStatus({
              id: id,
              entity: entity,
              state: "SUCCESS",
            })
          );
          createImageFromBlob(new Blob([res]), setImage);
          dispatch(
            addNotification({
              type: "success",
              message: "Фотография успешно загружена на сервер",
            })
          );
        })
        .catch((err) => {
          setImage('/no-photos.png');
          dispatch(
            setPhotoHolderFetchingStatus({
              id: id,
              entity: entity,
              state: "ERROR",
            })
          );
          dispatch(
            addNotification({
              type: "error",
              message: `Ошибка при загрузке фотографии на сервер (${err.message})`,
            })
          );
        });
    },
    [image, id, backendAddress, backendProtocol, backendPort, unit]
  );

  const handleDeleting = React.useCallback(() => {
    dispatch(
      setPhotoHolderFetchingStatus({
        id: id,
        entity: entity,
        state: "LOADING",
      })
    );
    deleteImage(
      {
        backendProtocol: backendProtocol,
        backendAddress: backendAddress,
        backendPort: backendPort,
      },
      resolveEntryPointByEntity(entity),
      id
    )
      .then((res) => {
        if (res === true) {
          setImage('/no-photos.png');
          dispatch(
            setPhotoHolderFetchingStatus({
              id: id,
              entity: entity,
              state: "SUCCESS",
            })
          );
          dispatch(
            addNotification({
              type: "success",
              message: "Фотография успешно удалена",
            })
          );
        }
      })
      .catch((err: Error) => {
        dispatch(
          setPhotoHolderFetchingStatus({
            id: id,
            entity: entity,
            state: "ERROR",
          })
        );
        dispatch(
          addNotification({
            type: "error",
            message: `Ошибка при удалении фотографии (${err.message})`,
          })
        );
      });
  }, [image, id, backendAddress, backendProtocol, backendPort, unit]);

  React.useEffect(() => {
    dispatch(
      setPhotoHolderFetchingStatus({
        id: id,
        entity: entity,
        state: "LOADING",
      })
    );
    fetchImage(
      {
        backendProtocol: backendProtocol,
        backendAddress: backendAddress,
        backendPort: backendPort,
      },
      resolveEntryPointByEntity(entity),
      id
    )
      .then((res) => {
        dispatch(
          setPhotoHolderFetchingStatus({
            id: id,
            entity: entity,
            state: "SUCCESS",
          })
        );
        if (res != undefined) {
          createImageFromBlob(res, setImage);
        } else {
          setImage('/no-photos.png');
        }
      })
      .catch((err) => {
        dispatch(
          setPhotoHolderFetchingStatus({
            id: id,
            entity: entity,
            state: "ERROR",
          })
        );
        dispatch(
          addNotification({
            type: "error",
            message: `Ошибка при загрузке фотографии с сервера ${err}`,
          })
        );
        setImage('/no-photos.png');
      });
  }, []);

  const { addRelativePhotoPermitted, deleteRelativePhotoPermitted } =
    useSelector(userPermissions);

  return (
    <Box
      margin={margin}
      width={width}
      height={height}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"flex-end"}
      flexGrow={1}
      border={"1px ridge #505050"}
    >
      <Avatar
        alt={'/no-photos.png'}
        src={image}
        sx={{ bgcolor: "#363640", width: "100%", height: "100%" }}
        variant={"square"}
      >
        <LoadingCurtain show={unit?.state == "LOADING"} />
        {image}
      </Avatar>
      {showControls && (
        <div className={styles.avatar__button_container}>
          {image === '/no-photos.png' && (
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              disabled={unit?.state === "LOADING" || !addRelativePhotoPermitted}
            >
              <input
                accept="image/*"
                id="icon-button-file"
                type="file"
                hidden
                onChangeCapture={handleUpload}
              />
              <PhotoCamera />
            </IconButton>
          )}
          {image !== '/no-photos.png' && (
            <>
              <IconButton
                color="primary"
                component="label"
                onClick={handleDeleting}
                disabled={
                  unit?.state == "LOADING" || !deleteRelativePhotoPermitted
                }
              >
                <DeleteForever />
              </IconButton>
            </>
          )}
        </div>
      )}
    </Box>
  );
};
