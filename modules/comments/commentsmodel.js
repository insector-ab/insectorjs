import {modelRegistry, modelIdentities} from 'guins/model';
import {FormModel} from 'insectorjs/models/form';
import ModuleModel from 'insectorjs/models/module';

/**
 * CommentsModel
 */
export class CommentsModel extends ModuleModel {

    get nodeId() {
        return this.props.nodeId;
    }

    get rawComments() {
        return this.get('comments');
    }
    set rawComments(value) {
        this.set('comments', value);
    }

    get commentForm() {
        // create form if not set
        if (!this.has('commentForm')) {
            // create form
            let form = new CommentFormModel();
            // register & set
            this.set('commentForm', modelRegistry.registerInstance(form).data);
        }
        return modelRegistry.getInstance(this.get('commentForm'));
    }

    get newCommentId() {
        return this.get('newCommentId');
    }
    set newCommentId(value) {
        this.set('newCommentId', value);
    }

    get showNewComment() {
        return this.get('showNewComment');
    }
    set showNewComment(value) {
        this.set('showNewComment', value);
    }

    get showAll() {
        return this.get('showAll');
    }
    set showAll(value) {
        this.set('showAll', value);
    }

    get limit() {
        return this.get('limit');
    }
    set limit(value) {
        this.set('limit', value);
    }

    _getDefaults() {
        let d = super._getDefaults();
        d.identity = CommentsModel.identity;
        d.showNewComment = false;
        d.showAll = false;
        d.limit = 5;
        d.comments = [];
        d.newCommentid = null;
        return d;
    }

}
CommentsModel.identity = 'comments.CommentsModel';

/**
 * CommentFormModel
 */
export class CommentFormModel extends FormModel {

    constructor(data) {
        // no data, add items
        if (!data) {
            data = {
                validation: ['nodeIdSet'],
                inputItems: [
                    {
                        name: 'comment',
                        validation: ['required']
                    }
                ]
            };
        }
        super(data);
    }

    _getDefaults(... constructorArgs) {
        let d = super._getDefaults();
        d.identity = CommentFormModel.identity;
        return d;
    }

}

// Register Classes/Constructors
modelIdentities.register(CommentsModel.identity, CommentsModel);
modelIdentities.register(CommentFormModel.identity, CommentFormModel);