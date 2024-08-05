import React, { FC, VFC, useCallback, useEffect, useRef } from "react";
import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from "./styles";
import autosize from "autosize";
import { Mention, SuggestionDataItem } from "react-mentions";
import { useParams } from "react-router";
import useSWR from 'swr';
import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import gravatar from 'gravatar';

interface Props {
  chat?: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder: string;
  data?: IUser[];
}

const ChatBox: FC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder, data }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if( textareaRef.current ) {
      autosize(textareaRef.current);
    }
  }, []);
  const onKeydownChat = useCallback((e) => {
    if (!e.nativeEvent.isComposing && e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e);
      }
    }
  }, [onSubmitForm]);

  const renderUserSuggestion: (
    suggestion: SuggestionDataItem, 
    search: string, 
    highlightedDisplay: React.ReactNode, 
    index: number, 
    focused: boolean,
  ) => React.ReactNode = useCallback (
    (member, search, highlightedDisplay, index, focus) => {
      if (!data) {
        return null;
      }
      return (
      <EachMention focus={focus}>
        <img src={gravatar.url(data[index].email, { s: '20px', d: 'retro' })} alt={data[index].nickname} />
        <span>{highlightedDisplay}</span>
      </EachMention>
      );
    }, [data],);

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
      <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyPress={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention appendSpaceOnAdd trigger="@"
            data={data?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderUserSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;