package techcourse.myblog.domain;

import org.springframework.util.StringUtils;

import java.util.Objects;

public class Article {
    private int id;
    private String title;
    private String coverUrl;
    private String contents;

    public Article(final int id, final String title, final String coverUrl, final String contents) {
        checkNull(title, coverUrl, contents);
        this.id = id;
        this.title = title;
        this.coverUrl = coverUrl;
        this.contents = contents;
    }

    private void checkNull(final String title, final String coverUrl, final String contents) {
        if (Objects.isNull(title) || Objects.isNull(coverUrl) || Objects.isNull(contents)) {
            throw new NullArticleElementException("빈 아티클 입력 요소가 존재합니다.");
        }
    }


    public boolean isSameId(int id) {
        return this.id == id;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public String getContents() {
        return contents;
    }


    @Override
    public boolean equals(final Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        final Article article = (Article) o;
        return id == article.id &&
                Objects.equals(title, article.title) &&
                Objects.equals(coverUrl, article.coverUrl) &&
                Objects.equals(contents, article.contents);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, coverUrl, contents);
    }
}
