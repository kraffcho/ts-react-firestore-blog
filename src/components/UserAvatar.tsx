import React from 'react';
import md5 from 'md5';

interface GravatarProps {
  email: string;
  size?: number;
}

const Gravatar: React.FC<GravatarProps> = ({ email, size = 50 }) => {
  const emailHash = md5(email.toLowerCase());
  const gravatarURL = `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=retro`;

  return <img src={gravatarURL} alt={email} width={size} height={size} className='comment-list__avatar' />;
};

export default Gravatar;