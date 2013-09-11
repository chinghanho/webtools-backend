set :application, "webtools"
set :user, "username"
set :domain, ""
# Uncomment the line below if your server need credential file.
# ssh_options[:keys] = ["~/.ssh/keypair.pem"]

set :scm, :git
set :repository, "git@github.com:chinghanho/webtools-backend.git"
set :branch, "master"

set :deploy_to, "/home/#{user}/#{application}"
set :keep_releases, 6
set :use_sudo, false
set :normalize_asset_timestamps, false
default_run_options[:pty] = true

set :default_environment, {
  "PATH" => "/home/ubuntu/.nvm/v0.10.18/bin:$PATH"
}

role :web, domain                   # Your HTTP server, Apache/etc
role :app, domain                   # This may be the same as your `Web` server
role :db,  domain, :primary => true # This is where Rails migrations will run

namespace :deploy do
end

# if you want to clean up old releases on each deploy uncomment this:
# after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end
