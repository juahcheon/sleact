import React, { useCallback } from "react";
import { Container, Header } from "./styles";
import useSWR, { mutate } from 'swr';
import fetcher from "@utils/fetcher";
import { useParams } from "react-router";
import gravatar from 'gravatar';
import useInput from "@hooks/useInput";
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import axios from "axios";
import { IDM } from "@typings/db";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `api/workspaces/${workspace}/dms/${id}/chats?perPage=20=&page=1`,
    fetcher,
  );

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (chat?.trim()) {
      axios.post(`api/workspaces/${workspace}/dms/${id}/chats`, {
        content: chat,
      })
      .then(() => {
        mutate;
        setChat('');
      })
      .catch(console.error);
    }
  }, [chat]);

  if (!userData || !myData) {
    return null;
  }

  return <Container>
    <Header>
      <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt="{userData.nickname}" />
      <span>{userData.nickname}</span>
    </Header>
    <ChatList chatData={chatData} />
    <ChatBox
        onSubmitForm={onSubmitForm}
        chat={chat}
        onChangeChat={onChangeChat}
        placeholder={`Message ${userData.nickname}`}
        data={[]}
      />
  </Container>
};

export default DirectMessage;