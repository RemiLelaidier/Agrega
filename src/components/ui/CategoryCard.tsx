import * as React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { ModalType } from 'src/App';

import './CategoryCard.css';
export interface CategoryCardProps {
    category: any;
    selected: boolean;
    onClick?: (any);
    onSelect?: (any);
}

class CategoryCard extends React.Component<CategoryCardProps> {

    /**
     * Main render function
     *
     * @returns
     * @memberof CategoryCard
     */
    render() {
        return(
            this.renderCard()
        );
    }

    /**
     * Render button
     *
     * @private
     * @returns
     * @memberof CategoryCard
     */
    private renderButton() {
        if(this.props.category) {
            return <Button onClick={this.onClick()} size="small">Accéder à la categorie</Button>;
        } else {
            return <Button onClick={this.onClick()}>Nouvelle catégorie</Button>
        }
    }

    /**
     * Render content function
     *
     * @private
     * @returns
     * @memberof CategoryCard
     */
    private renderContent() {
        if(this.props.category) {
            return (
                <div className="category-card">
                    <h3>{this.props.category.name}</h3>
                    <h4>{this.props.category.description}</h4>
                    <p>{this.props.category.ressources.length} articles</p>
                </div>
            );
        }
        return;
    }

    /**
     * Render card function
     *
     * @private
     * @returns
     * @memberof CategoryCard
     */
    private renderCard() {
        if(this.props.category) {
            const color: React.CSSProperties = {
                backgroundColor: this.props.category.color
            }

            const className = this.props.selected ? "card selected" : "card";

            return (
                <Card className={className} style={color}>
                    <CardContent>
                        {this.renderContent()}
                    </CardContent>
                    <CardActions>
                        {this.renderButton()}
                    </CardActions>
                </Card>
            );
        } else {
            return (
                <Card className="card">
                    <CardContent>
                        {this.renderContent()}
                    </CardContent>
                    <CardActions>
                        {this.renderButton()}
                    </CardActions>
                </Card>
            );
        }
    }

    onClick = () => () => {
        // If no category, then add a new category
        if(!this.props.category) {
            return this.props.onClick(ModalType.newCategory);
        }
        // Else select current category
        return this.props.onSelect(this.props.category.id);
    }
}

export default CategoryCard;