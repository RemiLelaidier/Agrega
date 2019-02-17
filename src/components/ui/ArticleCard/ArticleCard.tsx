import * as React from 'react';

import { Card, CardContent } from '@material-ui/core';
import MicrolinkCard from 'react-microlink';

import './ArticleCard.css';
export interface ArticleCardProps {
    article: any;
}

class ArticleCard extends React.Component<ArticleCardProps> {

    /**
     * Main render function
     *
     * @returns
     * @memberof ArticleCard
     */
    render() {
        return(
            <Card className="article-card">
                <CardContent>
                    {this.renderContent()}
                </CardContent>
            </Card>
        );
    }

    /**
     * render card content
     *
     * @returns
     * @memberof ArticleCard
     */
    renderContent() {
        const article = this.props.article;
        if(article) {
            return (
                <>
                    <h1>{article.name}</h1>
                    <p>{this.props.article.description}</p>
                    {this.renderMicroCard(article)}
                </>
            )
        }
        return;
    }

    /**
     * render micro card function
     *
     * @param {*} article
     * @returns
     * @memberof ArticleCard
     */
    renderMicroCard(article: any) {
        if(!article.url) {
            return;
        }

        return (
            <MicrolinkCard 
                key={article.name + "-" + article.id}
                className="info-card"
                url={article.url}
                force={true}
            />
        )
    }
}

export default ArticleCard;