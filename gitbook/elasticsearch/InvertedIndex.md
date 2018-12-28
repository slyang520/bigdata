# InvertedIndex 倒排索引
拿书做比喻  书的目录是正排索引，书的索引页是倒排索引
```
正排索引 文档id 到文档内容，文档单词 的关联关系
倒排索引 单词到 文档id 的关联关系 
```

## 组成
单次词典，倒排列表
```
单词词典：
1.记录所有文档的单词
2.记录单词到 倒排列表的关联关系（文档id）
```

```

```
# Analyzsis 分词
分词是将文本转化为一系列单次的过程，也可以叫文本分析

## Analyzer 分词器 分词器是es处理分词的组件

```
Character Filters
针对原始文本处理，比如取出HTML 标签
Tokenizer
将原始文本按照一定规则切分为单词
Token Filters
针对tokenizer 处理的单次再加工，比如转小写，删除，新增。
```

## [Analyzer API](EsRestApi.html)
## 常见分词器
## 中文分词 (IK , jieba) (Hanlp, THULAC)基于自然语言处理的分词

