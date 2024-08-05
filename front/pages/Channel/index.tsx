import { Container, Header } from '@pages/Channel/styles';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import React, { useCallback } from "react";
import useInput from '@hooks/useInput';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: channelData } = useSWR(`/api/workspaces/${workspace}/channels`, fetcher);

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    setChat('');
  }, []);
  return (
    <Container>
      <Header>채널!</Header>
      <ChatList />
      <ChatBox
        onSubmitForm={onSubmitForm}
        chat={chat}
        onChangeChat={onChangeChat}
        placeholder={`Message #${channel}`}
        data={[]}
      />
    </Container>
  );
};

export default Channel;