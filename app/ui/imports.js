'use client';

import {
    ArrowRight, BookOpen, Users, TrendingUp, Star, ArrowLeft, Twitter, Heart,
    MessageCircle,
    Bookmark,
    Share2,
    Calendar,
    Clock,
    Eye,
    Send,
    ThumbsUp,
    Reply,
} from "lucide-react";
import Button from '@/app/ui/components/general/button';
import Navbar from "./components/website/navbar/navbar";
import HeroSection from "./components/website/homePage/hero";
import StatisticsSection from "./components/website/homePage/statistics";
import FeaturesSection from "./components/website/homePage/features";
import Testimonials from "./components/website/homePage/testimonials";
import CallToAction from "./components/website/homePage/call-to-action";
import Footer from "./components/website/footer";
import { Menu, X } from 'lucide-react';
import { useState, React, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import { FiSearch } from 'react-icons/fi';
import { BiUserCircle } from 'react-icons/bi';
import { FaRegHeart, FaRegComment } from 'react-icons/fa';
import AppNavbar from "./components/webapp/navbar/navbar";
import Image from "next/image";
import ArticleCard from "./components/webapp/homepage/article-card";
import SuggestedProfilesModal from "./components/webapp/general/suggested-profiles-modal";
import { useRouter } from "next/navigation";
import { FaPencil } from "react-icons/fa6";
import { useUserStore } from "../store/user-store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import Cookies from 'js-cookie';
import HomeSkeleton from "./components/webapp/homepage/home-skeleton";
import { timeAgo } from "../utils/time-ago";
import { FaHeart } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import { CommentSection } from "./components/webapp/article-details/comments";
import { truncateText } from "../utils/truncate-text";
import { TextArea } from "./components/webapp/write/text-area";
import { SlateContentRenderer } from "./components/webapp/article-details/content";
import { FaBookmark } from "react-icons/fa";
import { WriteSettings } from "./components/webapp/write/settings";
import { PostCategories } from "./components/webapp/write/categories";
import { SuggestedForYouSkeleton } from "./components/webapp/general/suggested-profiles-skeleton";
import { BioSection } from "./components/webapp/profile/bio-section";
import { ProfileImages } from "./components/webapp/profile/profile-images";
import { UserAbout } from "./components/webapp/profile/active-tab/user-about";
import { UserActivity } from "./components/webapp/profile/active-tab/user-activity";
import { UserArticles } from "./components/webapp/profile/active-tab/user-articles";
import { UserPopularArticles } from "./components/webapp/profile/user-popular-articles";
import { UserQuickAction } from "./components/webapp/profile/user-quick-action";
import { formatDate } from "../utils/format-date";
import { IoCamera } from "react-icons/io5";
import { ProfileImageSkeleton } from "./components/webapp/general/profile-image-skeleton";
import { CoverImageSkeleton } from "./components/webapp/general/cover-image-skeleton";


import {
    LoginApi, SignupApi, GetAllExplorePostsApi, LikePostApi, UnlikePostApi, GetComments, CreateComments, UploadPostImages,
    CreatePostApi, CreateBookmark, DeleteBookmark, GetCategories, GetUsersIamNotFollowing, FollowUser, UnFollowUser, GetFeedPostsApi,
    GetUserProfile, GetUserPostsApi, UpdateUser
} from "../api/api";


export {
    ArrowRight, BookOpen, Users, TrendingUp, Star, Button, Navbar, HeroSection, StatisticsSection,
    FeaturesSection, Testimonials, CallToAction, Footer, Menu, X, useState, ArrowLeft, Twitter, React,
    FcGoogle, FaXTwitter, FiSearch, BiUserCircle, FaRegHeart, FaRegComment, AppNavbar, Image, ArticleCard,
    SuggestedProfilesModal, LoginApi, useRouter, FaPencil, useUserStore, useEffect, Link, usePathname,
    FaRegUser, IoSettingsOutline, FiLogOut, SignupApi, Cookies, GetAllExplorePostsApi, HomeSkeleton,
    timeAgo, LikePostApi, UnlikePostApi, FaHeart, IoIosHeartEmpty, Heart, MessageCircle, Bookmark, Share2,
    Calendar, Clock, Eye, Send, ThumbsUp, Reply, CommentSection, truncateText, GetComments, CreateComments,
    UploadPostImages, CreatePostApi, TextArea, SlateContentRenderer, FaBookmark, CreateBookmark, DeleteBookmark,
    WriteSettings, PostCategories, GetCategories, GetUsersIamNotFollowing, SuggestedForYouSkeleton, FollowUser,
    UnFollowUser, GetFeedPostsApi, GetUserProfile, BioSection, ProfileImages, UserAbout, UserActivity, UserArticles,
    UserPopularArticles, UserQuickAction, formatDate, GetUserPostsApi, UpdateUser, IoCamera, ProfileImageSkeleton,
    CoverImageSkeleton
};