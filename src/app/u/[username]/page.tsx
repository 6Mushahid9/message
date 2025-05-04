'use client'

import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { messageSchema } from '@/schemas/messageSchema'
import { z } from 'zod'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Loader from '@/components/Loader';
import { ApiResponse } from '@/types/apiResponse'
import { Lightbulb, Send, Sparkle } from 'lucide-react'

const messageTypes = [
  { value: 'conversation', label: 'Start a Conversation' },
  { value: 'compliment', label: 'Send a Compliment' },
  { value: 'question', label: 'Ask a Question' },
  { value: 'funfact', label: 'Fun Fact' },
  { value: 'motivational', label: 'Motivational' },
  { value: 'joke', label: 'Joke' },
  { value: 'roast', label: 'Friendly Roast' },
  { value: 'pickup', label: 'Pickup Line' },
  { value: 'sarcasm', label: 'Sarcastic Remark' },
  { value: 'showerthought', label: 'Shower Thought' },
  { value: 'advice', label: 'Advice' },
  { value: 'confession', label: 'Confession-style' },
  { value: 'poetic', label: 'Poetic Line' },
];

const ProfilePage = () => {
  const params = useParams();
  const username = params.username as string;
  
  const [isAccepting, setIsAccepting] = useState(true);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageType, setMessageType] = useState('roast');

  // i am not showing state just for fun 😈
  const fetchAcceptMessages = async () => {
    try {
      const res = await axios.get(`/api/accept-message?username=${username}`);
      setIsAccepting(res.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message?? "Failed to fetch message settings")
    }
  };
  
  const handleSendMessage = async () => {
    if (!isAccepting) {
      toast.error("User is not accepting messages");
      return;
    }
  
    setIsSending(true);
    // here i am not using ApiResponse because i am just lazy 😴
    try {
      // Validate the message using zod
      messageSchema.parse({ content: message });
  
      const res = await axios.post('/api/send-message', { username, content: message });
      if (res.data.success) {
        toast.success(res.data.message);
        setMessage('');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unable to send message");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggest = async () => {
    setIsSuggesting(true);
    try {
      const res = await axios.post('/api/suggest-message',{type: messageType});
      setSuggestedMessages(res.data.suggestions);
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message?? "Unable to suggest message")
    }
    setIsSuggesting(false);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchAcceptMessages();  // wait for completion
      await handleSuggest();        // wait for completion
      setLoading(false);
    };
  
    if (username) {
      init();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-gray-900">
        <Loader />
      </div>
    );
  }
  
  return (
    <div className='flex-grow flex flex-col px-4 md:px-24 py-12 bg-gray-800 text-white min-h-screen'>
      <h1 className='text-3xl md:text-5xl font-bold text-center'>Public Profile Link</h1> 
      <p className='mt-10 text-xl md:text-2xl font-bold'>Send anonymous message to {username}</p>

      <Input
        className='mt-5 border border-dashed'
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Write your message here'
        name="message"
      />

      <Button
        onClick={handleSendMessage}
        disabled={isSending}
        className='w-min p-6 text-sm md:text-xl font-bold mx-auto mt-5 cursor-pointer disabled:opacity-50'
      >
        {isSending ? 'Sending...' : <>Send <Send /></>}
      </Button>

      <div className='flex justify-between mt-10'>
        <Button
          onClick={handleSuggest}
          className='w-min p-6 text-sm md:text-xl font-bold cursor-pointer'
          disabled={isSuggesting}
        >
          {isSuggesting ? 'Thinking...' : <>Suggest Message <Lightbulb className='size-6'/></>}
        </Button>

        {/* dropdown for suggestion types */}
        <select
          value={messageType}
          onChange={(e) => setMessageType(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-md w-full max-w-sm border"
        >
          {messageTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <Button className='w-min p-6 text-sm md:text-xl font-bold cursor-pointer'>
        <Link href="/sign-up" target="_blank" rel="noopener noreferrer">Wanna have an Account ?</Link>
        </Button>
      </div>

      {/* showing suggested messages here */}
      <div className='mt-10 border rounded-2xl p-2 space-y-2'>
        {suggestedMessages.map((msg, idx) => (
          <p
            key={idx}
            className='cursor-pointer hover:bg-gray-700 p-2 rounded-md'
            onClick={() => setMessage(msg)}
          >
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
