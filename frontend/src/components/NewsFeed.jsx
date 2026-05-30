import React, { useState } from 'react';
import axios from 'axios';
import { Search, Newspaper, ExternalLink, RefreshCw } from 'lucide-react';

const SUGGESTED_TOPICS = ['AI & Technology', 'India Politics', 'World News', 'Science', 'Sports', 'Business', 'Health', 'Climate'];

const NewsFeed = () => {
  const [interests, setInterests] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchNews = async (query = interests) => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const token = localStorage.getItem('token');
      const baseApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.get(`${baseApiUrl}/news?interests=${encodeURIComponent(query)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setArticles(res.data.articles || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch news. Check your NEWS_API_KEY.');
    } finally {
      setLoading(false);
    }
  };

  const addTopic = (topic) => {
    const current = interests.split(',').map(s => s.trim()).filter(Boolean);
    if (!current.includes(topic)) {
      const updated = [...current, topic].join(', ');
      setInterests(updated);
    }
  };

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-indigo-400" /> News Discovery
        </h2>
        <p className="text-slate-400 text-sm">Enter your interests and we'll fetch the latest real news articles tailored for you.</p>
      </div>

      {/* Search bar */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 mb-6">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={interests}
            onChange={e => setInterests(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchNews()}
            placeholder="e.g. AI, India politics, climate change, sports..."
            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 outline-none transition-colors"
          />
          <button
            onClick={() => fetchNews()}
            disabled={loading || !interests.trim()}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Fetching...' : 'Discover'}
          </button>
        </div>

        {/* Quick topic chips */}
        <div>
          <p className="text-xs text-slate-500 font-bold mb-2 uppercase tracking-wide">Quick Topics</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TOPICS.map(topic => (
              <button
                key={topic}
                onClick={() => addTopic(topic)}
                className="text-xs px-3 py-1.5 bg-slate-900/60 border border-slate-700 text-slate-300 rounded-full hover:border-indigo-500/40 hover:text-indigo-300 transition-colors font-medium"
              >
                + {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {searched && !loading && articles.length === 0 && !error && (
        <div className="text-center py-12 text-slate-500">
          <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No articles found. Try different keywords.</p>
        </div>
      )}

      {articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="group bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-indigo-500/30 hover:bg-slate-800/60 transition-all flex flex-col"
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                  onError={e => e.target.style.display = 'none'}
                />
              )}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    {article.source?.name || 'News'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <h3 className="text-white text-sm font-bold leading-snug mb-2 line-clamp-3 group-hover:text-indigo-300 transition-colors flex-1">
                  {article.title}
                </h3>
                {article.description && (
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3">{article.description}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-indigo-400 font-bold mt-auto">
                  Read Full Article <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {!searched && (
        <div className="text-center py-16 text-slate-600">
          <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-bold text-slate-500">Your personalized news feed awaits</p>
          <p className="text-sm mt-1">Enter any topics above to get started</p>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
