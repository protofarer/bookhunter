import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Constants from './constants';
import './App.css';
import { SortedResults, SearchResults, SortType } from './types';
import { sortDocsBySortType } from './util';
import Results from './components/Results';
import SearchBar from './components/SearchBar';
import { useQuery } from '@tanstack/react-query';
import Spinner from './components/Spinner';

export default function App() {
  return <div className="App"></div>;
}
