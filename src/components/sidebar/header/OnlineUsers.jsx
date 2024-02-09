import { IconArrowBack, IconWifi } from "@tabler/icons-react";
import {
  ActionIcon,
  Group,
  Grid,
  Divider,
  Stack,
  Text,
  Avatar,
  Title,
} from "@mantine/core";
import { useEffect } from "react";
import { useClickOutside } from "@mantine/hooks";

function OnlineUsers({ setShowOnlineUsers, onlineUsers }) {
  const clickOutSideRef = useClickOutside(() => setShowOnlineUsers(false));
  useEffect(() => {
    console.log(onlineUsers);
  }, [onlineUsers]);
  return (
    <div
      ref={clickOutSideRef}
      className="slide-up-animation relative flex0030 h-full z-40"
    >
      {/*Container*/}
      <div className="mt-5">
        <ActionIcon
          variant="subtle"
          size={30}
          color="gray"
          aria-label="Online Users"
          onClick={() => setShowOnlineUsers(false)}
        >
          <IconArrowBack
            size={12}
            style={{ width: "100%", height: "100%" }}
            stroke={2}
          />
        </ActionIcon>

        <Group justify="center">
          <Title order={4}>Çevrimiçi Temsilciler</Title>
        </Group>
        {/*Online Users*/}
        {onlineUsers &&
          onlineUsers.map((user, index) => (
            <Stack
              spacing={"xl"}
              style={{ marginLeft: 10, marginTop: 10, marginRight: 10 }}
              key={index}
            >
              <Grid gutter={{ base: 1.5 }} align="center">
                <Grid.Col span={1.2}>
                  <Avatar src={user.userId.picture} />
                </Grid.Col>
                <Grid.Col span={3.5}>
                  <Text>{user.userId.name}</Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text>{user.userId.email}</Text>
                </Grid.Col>
                <Grid.Col span={1} offset={4}>
                  <IconWifi
                    color="#008069"
                    size={12}
                    style={{ width: "80%", height: "80%" }}
                    stroke={1.5}
                  />
                </Grid.Col>
              </Grid>
              <Divider margins="xs"></Divider>
            </Stack>
          ))}
      </div>
    </div>
  );
}

export default OnlineUsers;
