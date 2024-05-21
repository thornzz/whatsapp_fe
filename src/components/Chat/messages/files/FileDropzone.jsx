import { Flex, Group, rem, Text } from "@mantine/core";
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_POWERPOINT_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  PDF_MIME_TYPE,
} from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import React from "react";
import { useDispatch } from "react-redux";

import { addFiles } from "../../../../features/chatSlice";
import { getFileType } from "../../../../utils/file";

const FileDropzone = () => {
  const dispatch = useDispatch();
  return (
    <Dropzone.FullScreen
      activateOnDrag={true}
      accept={[
        IMAGE_MIME_TYPE,
        PDF_MIME_TYPE,
        MS_WORD_MIME_TYPE,
        MS_EXCEL_MIME_TYPE,
        MS_POWERPOINT_MIME_TYPE,
        "text/plain",
      ]}
      onDrop={(files) => {
        // eslint-disable-next-line array-callback-return
        files.map((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            dispatch(
              addFiles({
                file: file,
                type: getFileType(file.type),
              })
            );
          };
          reader.readAsDataURL(file);
        });
      }}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <Group>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-green-6)",
              }}
              stroke={1.5}
            />
            <Flex justify="center" direction={"column"} gap={4}>
              <Text size="xl" inline>
                Dosyalarınızı buraya sürükleyip bırakın
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Dosya boyutu 10MB'ı geçemez
              </Text>
            </Flex>
          </Group>
        </Dropzone.Accept>
        <Dropzone.Reject>
          <Group>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-blue-6)",
              }}
              stroke={1.5}
            />
            <Text size="xl" inline>
              Desteklenmeyen dosya formatı
            </Text>
          </Group>
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-dimmed)",
            }}
            stroke={1.5}
          />
        </Dropzone.Idle>
      </Group>
    </Dropzone.FullScreen>
  );
};

export default FileDropzone;
