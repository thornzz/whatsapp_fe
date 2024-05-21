import {
  ActionIcon,
  Avatar,
  Divider,
  Grid,
  Group,
  Indicator,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { IconArrowBack, IconWifi } from "@tabler/icons-react";

function OnlineUsers({ setShowOnlineUsers, onlineUsers, setSelectedAction }) {
  const clickOutSideRef = useClickOutside(() => {
    setShowOnlineUsers(false);
    setSelectedAction((prev) => ({
      current: prev.previous,
      previous: "users",
    }));
  });

  return (
    <div ref={clickOutSideRef} className="slide-up-animation h-full relative ">
      {/*Container*/}
      <div className="mt-5">
        <ActionIcon
          variant="subtle"
          size={30}
          color="gray"
          aria-label="Online Users"
          onClick={() => {
            setShowOnlineUsers(false);
            setSelectedAction((prev) => ({
              current: prev.previous,
              previous: "users",
            }));
          }}
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
                  <Indicator
                    inline
                    processing
                    color="green"
                    size={10}
                    offset={5}
                    position="bottom-end"
                    withBorder
                  >
                    <Avatar src={user.user.picture} size={28} />
                  </Indicator>
                </Grid.Col>
                <Grid.Col span={3.5}>
                  <Text size="sm">{user.user.name}</Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  <Text size="sm">{user.user.email}</Text>
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
