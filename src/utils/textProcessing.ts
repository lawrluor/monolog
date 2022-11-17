/*
Copyright (c) 2011, Chris Umbel
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Determine unwanted words 
// Note: the presence of negative words in these contractions makes them potentially important
// const contractions = [`ain't`, `aren't`, `can't`, `cannot`, `could've`, `couldn't`, `didn't`, `doesn't`, `don't`, `dunno`, `gonna`, `hasn't`, `haven't`, `hadn't`, `he'd`, `he'll`, `he's`, ];
const fillers = ['um', 'ah', 'umm', 'hmm', 'hm', 'so', 'yeah', `uh`, `er`, `ahh`, `like`];
const specialChars =  ['\n', '\t', 'undefined'];
const possessives = [`i'm`, `i'd`, `i'll`, `he's`, `he'll`, `he'd`, `she's`, `she'll`, `she'd`, `it'll`, `it's`, `its`, `let's`, `that's`, `that'd`, `they'll`, `they'd`, `their`, `they're`, `they've`, `we'll`, `we've`, `we'd`, `we're`, `who'll`, `who'd`, `who's`, `who've`, `who're`, `why'd`, `why're`, `you'd`, `you'll`, `you're`, `you've`, `what's`, `what'd`, `what'll`, `what're`];
const engStopWords = ['about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can', 'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had', 'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into', 'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must', 'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over', 'said', 'same', 'should', 'since', 'some', 'still', 'such', 'take', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were', 'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i']
export const filteredWords = [...fillers, ...specialChars, ...possessives, ...engStopWords, ];

// See https://stackoverflow.com/a/4328722
export const removePunctuation = (s: string): string => {
  let punctuationless = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");  // replace with empty string
  let finalString = punctuationless.replace(/\s{2,}/g," ");  // remove spaces from deletions
  return finalString
} 