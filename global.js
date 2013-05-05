       GraphsModel = new Meteor.Collection("Graphs");
        NodesModel = new Meteor.Collection("Nodes");
RelationshipsModel = new Meteor.Collection("Relationships");

if(Meteor.isServer){
    GraphsModel.allow({
        'insert' : graph_user_match,
        'remove' : multi_graph_user_match,
        'update' : multi_graph_user_match
    });

    function graph_user_match(user, doc){
        if(doc.owner != user){
            return false;
        }
        return true;
    }
    function multi_graph_user_match(user, docs){
        return _.all(docs, function(doc){
            return graph_user_match(user, doc);
        });
    }
    NodesModel.allow({
        'insert' : node_user_match,
        'remove' : multi_node_user_match,
        'update' : multi_node_user_match
    });
    function node_user_match(user, doc){
        return graph_user_match(user, GraphsModel.findOne({_id: doc.graph}));
    }
    function multi_node_user_match(user, docs){
        return _.all(docs, function(doc){
            return node_user_match(user, doc);
        })
    }
    RelationshipsModel.allow({
        'insert' : rel_user_match,
        'remove' : multi_rel_user_match,
        'update' : multi_rel_user_match
    });
    function rel_user_match(user, doc){
        var node_a = node_user_match(user, NodesModel.findOne({_id: doc.node_a}));
        var node_b = node_user_match(user, NodesModel.findOne({_id: doc.node_b}));
        return (node_a && node_b);
    }
    function multi_rel_user_match(user, docs){
        return _.all(docs, function(doc){
            return rel_user_match(user, doc);
        });
    }
}